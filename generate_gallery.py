import re

html_file = "/Users/ino/Documents/Project Google Antigravity/Portfollios PERSO/index.html"
with open(html_file, 'r') as f:
    content = f.read()

def generate_item(title, category, img, id):
    return f'''
          <div class="gallery-item interactive" data-cursor="zoom">
            <div class="gallery-img-wrapper">
              <img src="{img}" alt="{title}" class="gallery-img">
            </div>
            <div class="gallery-overlay">
              <span class="gallery-category">{category}</span>
              <h3 class="gallery-title">{title} {id}</h3>
            </div>
          </div>'''

def generate_category(title, count, cat_name, img):
    items = "\n".join([generate_item(f"{title} Projet", cat_name, img, i+1) for i in range(count)])
    return f'''
        <div class="gallery-subcategory">
          <div class="subcategory-header">
            <h3 class="subcategory-title">{title}</h3>
            <p class="subcategory-count">{count} Créations</p>
          </div>
          <div class="gallery-grid">
{items}
          </div>
        </div>'''

new_gallery = f'''<div class="gallery-subcategories">
{generate_category("Sites Web", 6, "Création Web", "https://cdn.prod.website-files.com/67997642f3d403660d64bfea/68dbf736b72a5c7ce0549e33_space-p-2000.jpg")}
{generate_category("Applications", 8, "Mobile / Web App", "https://cdn.prod.website-files.com/67997642f3d403660d64bfea/68dc4c00868ab229f5e260c9_85e495639ddf70c388e258624875ae3b_AI_STUDIO_MEK_SITE-p-2000.jpg")}
{generate_category("Projets Fictifs", 4, "Concept", "https://cdn.prod.website-files.com/67997642f3d403660d64bfea/68dd2c851ee0b4bb8137c8c1_AI_DogFocusGroup-p-2000.jpg")}
        </div>'''

# Replace in file
import re
start_marker = r'<div class="gallery-grid">'
end_marker = r'</div>\s*</div>\s*</section>'

pattern = re.compile(start_marker + r'.*?' + end_marker, re.DOTALL)
match = pattern.search(content)

if match:
    new_content = content[:match.start()] + new_gallery + "\n      </div>\n    </section>" + content[match.end():]
    with open(html_file, 'w') as f:
        f.write(new_content)
    print("HTML updated successfully!")
else:
    print("Could not find gallery-grid block.")
