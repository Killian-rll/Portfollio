const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 8000;
const BASE_DIR = path.join(__dirname, 'www.mekanism.com');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const DOMAINS_TO_REWRITE = [
  'cdn.prod.website-files.com',
  'd3e54v103j8qbb.cloudfront.net',
  'cdn.jsdelivr.net',
  'ajax.googleapis.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'player.vimeo.com',
  'f.vimeocdn.com',
  'i.vimeocdn.com',
  'arclight.vimeo.com',
  'lensflare.vimeo.com',
  'vod-adaptive-ak.vimeocdn.com',
  'www.mekanism.com'
];

// Helper to rewrite text content
function rewriteContent(content) {
  let rewritten = content;
  // Replace absolute URLs like https://domain or //domain with relative paths /domain
  DOMAINS_TO_REWRITE.forEach(domain => {
    // Replace https://domain
    const httpsRegex = new RegExp(`https:\\/\\/${domain}`, 'g');
    rewritten = rewritten.replace(httpsRegex, `/${domain}`);

    // Replace http://domain
    const httpRegex = new RegExp(`http:\\/\\/${domain}`, 'g');
    rewritten = rewritten.replace(httpRegex, `/${domain}`);

    // Replace //domain (protocol-relative)
    const protoRegex = new RegExp(`\\/\\/${domain}`, 'g');
    rewritten = rewritten.replace(protoRegex, `/${domain}`);
  });
  return rewritten;
}

// Proxy function to fetch missing files from the real internet
function proxyRequest(domain, originalPath, res) {
  const url = `https://${domain}${originalPath}`;
  console.log(`[Proxying] ${url}`);

  https.get(url, (proxyRes) => {
    if (proxyRes.statusCode === 200) {
      // Set headers from the proxy response
      res.writeHead(200, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*'
      });
      proxyRes.pipe(res);
    } else {
      console.log(`[Proxy Failed] ${url} returned status ${proxyRes.statusCode}`);
      res.writeHead(proxyRes.statusCode);
      res.end();
    }
  }).on('error', (err) => {
    console.error(`[Proxy Error] for ${url}:`, err);
    res.writeHead(500);
    res.end('Proxy Error');
  });
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL and decode URI components (like %20 for spaces)
  let reqUrl = decodeURIComponent(req.url.split('?')[0]);

  let localFilePath;
  let isMirrorFile = false;

  // Dual Routing System:
  // 1. Root and local assets -> serve our new custom portfolio
  // 2. /mekanism path -> serve the original downloaded website
  // 3. Domain assets (eg: /cdn.prod.website-files.com) -> serve from cached domain folders
  if (reqUrl === '/' || reqUrl === '/index.html') {
    localFilePath = path.join(__dirname, 'index.html');
  } else if (reqUrl === '/style.css') {
    localFilePath = path.join(__dirname, 'style.css');
  } else if (reqUrl === '/app.js') {
    localFilePath = path.join(__dirname, 'app.js');
  } else if (reqUrl === '/mekanism' || reqUrl === '/mekanism/' || reqUrl === '/mekanism/index.html') {
    localFilePath = path.join(__dirname, 'www.mekanism.com', 'www.mekanism.com', 'index.html');
    isMirrorFile = true;
  } else {
    // Check if it belongs to one of the cached domain folders
    const pathParts = reqUrl.split('/').filter(Boolean);
    if (pathParts.length > 0 && DOMAINS_TO_REWRITE.includes(pathParts[0])) {
      localFilePath = path.join(__dirname, 'www.mekanism.com', reqUrl);
      isMirrorFile = true;
    } else {
      // General static file serving relative to root
      localFilePath = path.join(__dirname, reqUrl);
    }
  }

  // Check if file exists locally
  fs.stat(localFilePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(localFilePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Serve text files with rewrites on-the-fly (ONLY for mirror files)
      if (isMirrorFile && ['.html', '.css', '.js', '.json'].includes(ext)) {
        fs.readFile(localFilePath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error reading file');
            return;
          }

          const rewrittenData = rewriteContent(data);
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(rewrittenData);
        });
      } else {
        // Serve files directly
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(localFilePath);
        stream.pipe(res);
      }
    } else {
      // File not found locally - check if it belongs to one of the rewritten domains to proxy
      const pathParts = reqUrl.split('/').filter(Boolean);
      if (pathParts.length > 0 && DOMAINS_TO_REWRITE.includes(pathParts[0])) {
        const domain = pathParts[0];
        const originalPath = '/' + pathParts.slice(1).join('/');
        proxyRequest(domain, originalPath, res);
      } else {
        console.log(`[404] File not found and cannot proxy: ${reqUrl}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Double Serveur Local en cours d'exécution !`);
  console.log(`👉 Ton Portfolio : http://localhost:${PORT}`);
  console.log(`👉 Miroir Mekanism : http://localhost:${PORT}/mekanism/`);
  console.log(`==================================================`);
});
