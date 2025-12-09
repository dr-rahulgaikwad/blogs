# Dr. Rahul Gaikwad - Personal Blog

A modern, responsive blog built with vanilla HTML, CSS, and JavaScript featuring a VS Code/HashiCorp Terraform inspired design theme.

## Features

- 🎨 **Modern Design**: VS Code + HashiCorp Terraform inspired theme
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🌙 **Dark/Light Theme**: Toggle between dark and light modes
- 🔍 **Search**: Real-time search through blog posts by title and tags
- 📝 **Markdown Support**: Write posts in Markdown with frontmatter
- 🚀 **Auto-Discovery**: Automatically discovers and indexes new blog posts
- ⚡ **Fast Loading**: Optimized for performance with minimal dependencies
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blogs
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **Visit** `http://localhost:8000`

## Adding New Blog Posts (Like Medium!)

**Just write and push - everything else is automatic!**

1. Create a new `.md` file in the `posts/` directory
2. Write your blog in Markdown:
   ```markdown
   # Your Blog Title
   
   Your introduction paragraph here...
   
   ## Section 1
   Content...
   ```
3. Push to GitHub
4. **Done!** The system automatically:
   - ✅ Generates title from your H1 heading
   - ✅ Calculates read time (200 words/min)
   - ✅ Sets today's date
   - ✅ Extracts description from first paragraph
   - ✅ Adds author name
   - ✅ Sorts to top of blog list (newest first)

**Optional:** Add custom frontmatter if needed:
```yaml
---
tags: ["aws", "terraform", "devops"]
---
```

## Project Structure

```
blogs/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── main.js            # Main JavaScript
├── posts/
│   ├── *.md                   # Blog post files
│   └── posts-index.json       # Auto-generated index
├── .github/
│   └── workflows/
│       └── update-posts.yml   # Auto-update posts on push
├── index.html                 # Main blog page
├── whoami.html               # About page
├── package.json              # Project configuration
└── update-posts.js           # Post indexing script
```

## Customization

### Theme Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
  --purple-primary: #C084FF;
  --green-primary: #4CAF50;
  --bg-primary: #0E0E0F;
  /* ... */
}
```

### Personal Information
Update the following files:
- `whoami.html` - About page content
- `index.html` - Hero section and links
- `assets/js/main.js` - Typing animations and quotes

## Deployment

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. The workflow will auto-update posts on new commits

### Custom Domain
1. Add `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **Showdown.js** - Markdown to HTML conversion
- **GitHub Actions** - Automated post indexing

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## License

MIT License - feel free to use this for your own blog!

## Author

**Dr. Rahul Gaikwad**
- Portfolio: [dr-rahulgaikwad.com](https://dr-rahulgaikwad.com/)
- LinkedIn: [dr-rahul-gaikwad](https://www.linkedin.com/in/dr-rahul-gaikwad/)
- GitHub: [dr-rahulgaikwad](https://github.com/dr-rahulgaikwad)