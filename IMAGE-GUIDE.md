# 📁 Automated Image Management

## ✨ What Happens Now:

When you add a blog, the system automatically:

1. **Creates folder**: `images/blogname/`
2. **Renames images**: `blogname01.jpg`, `blogname02.jpg`, etc.
3. **Updates paths**: Changes `image-1.png` → `images/blogname/blogname01.jpg`

## 📝 Example:

**Blog file**: `smart_infra.md`
**Images folder**: `images/smartinfra/`
**Image names**: 
- `smartinfra01.jpg`
- `smartinfra02.jpg` 
- `smartinfra03.jpg`

## 🚀 Usage:

Just use any image names in your markdown:
```markdown
![Description](my-image.png)
<img src="photo.jpg" alt="Photo" />
```

The system will automatically:
- Create the folder
- Rename images with proper numbering
- Update all image paths

**No manual image management needed!** 🎉