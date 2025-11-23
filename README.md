# Dr. Raul Gaikwad - Personal Blog

A static blog website built with HTML, CSS, and JavaScript. Features markdown-based blog posts with dynamic loading and a dark theme with purple accents.

## Features

- **Static Site**: Pure HTML, CSS, and JavaScript - no frameworks required
- **Markdown Support**: Blog posts written in markdown and dynamically converted to HTML
- **Dark Theme**: Professional dark mode with purple accent colors
- **Responsive Design**: Works on desktop and mobile devices
- **Typing Animation**: Animated hero section with typing effect
- **Navigation**: Clean navigation between Blogs and About pages

## Structure

```
blogs/
├── index.html          # Main blog page with hero and post list
├── whoami.html         # About page with terminal-style layout
├── assets/
│   ├── css/style.css   # Dark theme styling with purple accents
│   ├── js/main.js      # JavaScript for markdown loading and animations
│   └── images/         # Image assets directory
├── posts/
│   └── example-blog.md # Example blog post in markdown
├── CNAME               # Domain configuration (empty)
└── README.md           # This file
```

## Usage

1. **Adding New Posts**: 
   - Create new `.md` files in the `posts/` directory
   - Add post metadata to the `posts` array in `main.js`

2. **Customization**:
   - Update the ASCII art title in `index.html`
   - Modify the typing animation phrases in `main.js`
   - Customize colors in the CSS variables section

3. **Deployment**:
   - Upload to any static hosting service (GitHub Pages, Netlify, etc.)
   - Add your domain to the CNAME file if using a custom domain

## Dependencies

- **Showdown.js**: Loaded via CDN for markdown to HTML conversion
- **No build process required**: Everything runs in the browser

## Browser Support

Works in all modern browsers that support ES6+ features.