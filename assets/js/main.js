// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Dynamic blog posts - automatically loaded from /posts/ folder
let posts = [];

// Auto-discover ALL markdown files from posts directory
async function loadAllPosts() {
    try {
        let postFiles = [];
        
        // Try GitHub API first (works when hosted on GitHub Pages)
        try {
            const repoPath = window.location.hostname.includes('github.io') ? 
                window.location.pathname.split('/')[1] : 'blogs-Dr. Raul Gaikwad';
            const apiUrl = `https://api.github.com/repos/dr-rahulgaikwad/${repoPath}/contents/posts`;
            
            const response = await fetch(apiUrl);
            if (response.ok) {
                const files = await response.json();
                postFiles = files
                    .filter(file => file.name.endsWith('.md') && file.type === 'file')
                    .map(file => file.name);
                console.log('GitHub API discovery successful:', postFiles);
            } else {
                throw new Error('GitHub API failed');
            }
        } catch (error) {
            console.log('GitHub API failed, using comprehensive scan...');
            
            // Fallback: Comprehensive filename scanning
            const allPossibleFiles = [];
            
            // Known existing files
            const knownFiles = [
                'medium_converted.md', 'aws-cloud-architecture.md', 'my-coding-journey.md',
                'web-dev-practices.md', 'javascript-basics.md', 'example-blog.md',
                'dynamic-template.md', 'template.md'
            ];
            allPossibleFiles.push(...knownFiles);
            
            // Common patterns with numbers
            const patterns = [
                'blog', 'post', 'article', 'medium', 'new', 'latest', 'terraform', 'aws', 
                'cloud', 'devops', 'tech', 'guide', 'tutorial', 'tips', 'docker', 'kubernetes',
                'python', 'javascript', 'react', 'node', 'api', 'database', 'security'
            ];
            
            patterns.forEach(pattern => {
                // Pattern with numbers
                for (let i = 1; i <= 20; i++) {
                    allPossibleFiles.push(`${pattern}-${i}.md`);
                    allPossibleFiles.push(`${pattern}${i}.md`);
                }
                // Pattern with common suffixes
                ['guide', 'tutorial', 'tips', 'basics', 'advanced', 'intro'].forEach(suffix => {
                    allPossibleFiles.push(`${pattern}-${suffix}.md`);
                });
            });
            
            // Test each possible file
            const batchSize = 10;
            for (let i = 0; i < allPossibleFiles.length; i += batchSize) {
                const batch = allPossibleFiles.slice(i, i + batchSize);
                const promises = batch.map(async filename => {
                    try {
                        const response = await fetch(`posts/${filename}`, { method: 'HEAD' });
                        return response.ok ? filename : null;
                    } catch {
                        return null;
                    }
                });
                
                const results = await Promise.all(promises);
                postFiles.push(...results.filter(Boolean));
            }
            
            console.log('Comprehensive scan found:', postFiles);
        }
        
        // Remove duplicates
        postFiles = [...new Set(postFiles)];
        posts = [];
        
        // Load each discovered file
        for (const filename of postFiles) {
            try {
                const response = await fetch(`posts/${filename}`);
                if (response.ok) {
                    const markdown = await response.text();
                    const { frontmatter } = parseFrontmatter(markdown);
                    
                    // Auto-generate metadata if missing
                    const post = {
                        title: frontmatter.title || filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        file: filename,
                        date: frontmatter.date || new Date().toISOString().split('T')[0],
                        description: frontmatter.summary || frontmatter.description || 'Click to read this blog post.',
                        tags: frontmatter.tags || ['blog']
                    };
                    
                    posts.push(post);
                }
            } catch (error) {
                console.log(`Could not load ${filename}:`, error);
            }
        }
        
        // Sort by date DESC
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(`✅ Auto-discovered and loaded ${posts.length} blog posts`);
        console.log('Posts data:', posts);
        
    } catch (error) {
        console.error('Error in auto-discovery:', error);
    }
}

// TO ADD NEW BLOG:
// 1. Upload your .md file to /posts/ folder in GitHub
// 2. Refresh page - everything else is FULLY AUTOMATIC!
// 3. No code changes needed - the system auto-discovers new files!

// Removed typing animation - using static brutalist design

// Filter posts based on search query
function filterPosts(query) {
    if (!query.trim()) return posts;
    
    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
}

// Render posts list with clickable links
function renderPostsList(postsToRender = posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error('Posts container not found!');
        return;
    }
    
    console.log('Rendering posts:', postsToRender.length, postsToRender);
    postsContainer.innerHTML = '';
    
    if (postsToRender.length === 0) {
        console.log('No posts to render');
        postsContainer.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
        return;
    }
    
    postsToRender.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        
        // Create tags HTML
        const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
        
        postElement.innerHTML = `
            <h4 class="post-title">${post.title}</h4>
            <p class="post-date">${post.date}</p>
            <p class="post-description">${post.description}</p>
            <div class="post-tags">${tagsHTML}</div>
        `;
        
        // Add click event to open post in new tab
        postElement.addEventListener('click', () => {
            const newTab = window.open('', '_blank');
            newTab.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${post.title} - Dr. Rahul Gaikwad</title>
                    <link rel="stylesheet" href="assets/css/style.css">
                </head>
                <body>
                    <nav class="navbar">
                        <div class="nav-container">
                            <div class="nav-links">
                                <a href="index.html" class="nav-link">← Back to Blog</a>
                            </div>

                        </div>
                    </nav>
                    <main class="content">
                        <div id="blog-content">Loading...</div>
                    </main>
                    <script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
                    <script>
                        // Theme initialization for new tab
                        function initTheme() {
                            const themeToggle = document.getElementById('theme-toggle');
                            const currentTheme = localStorage.getItem('theme') || 'dark';
                            document.documentElement.setAttribute('data-theme', currentTheme);
                            if (themeToggle) {
                                themeToggle.addEventListener('click', () => {
                                    const currentTheme = document.documentElement.getAttribute('data-theme');
                                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                                    document.documentElement.setAttribute('data-theme', newTheme);
                                    localStorage.setItem('theme', newTheme);
                                });
                            }
                        }
                        
                        ${parseFrontmatter.toString()}
                        ${createBlogHeader.toString()}
                        ${loadPost.toString()}
                        
                        // Initialize everything
                        initTheme();
                        loadPost('${post.file}');
                    </script>
                </body>
                </html>
            `);
        });
        postsContainer.appendChild(postElement);
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const filteredPosts = filterPosts(e.target.value);
        renderPostsList(filteredPosts);
    });
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, content: markdown };
    }
    
    const frontmatterText = match[1];
    const content = match[2];
    const frontmatter = {};
    
    // Simple YAML parser for basic key-value pairs
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes and parse arrays
            value = value.replace(/^["']|["']$/g, '');
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
            }
            
            frontmatter[key] = value;
        }
    });
    
    return { frontmatter, content };
}

// Create dynamic blog header based on frontmatter
function createBlogHeader(frontmatter) {
    let headerHTML = '';
    
    if (frontmatter.title) {
        headerHTML += `<h1 class="blog-title">${frontmatter.title}</h1>`;
    }
    
    if (frontmatter.date || frontmatter.author || frontmatter.readTime) {
        headerHTML += '<div class="blog-meta">';
        if (frontmatter.date) headerHTML += `<span class="blog-date">📅 ${frontmatter.date}</span>`;
        if (frontmatter.author) headerHTML += `<span class="blog-author">👤 ${frontmatter.author}</span>`;
        if (frontmatter.readTime) headerHTML += `<span class="blog-read-time">⏱️ ${frontmatter.readTime}</span>`;
        headerHTML += '</div>';
    }
    
    if (frontmatter.summary) {
        headerHTML += `<div class="blog-summary">${frontmatter.summary}</div>`;
    }
    
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
        headerHTML += '<div class="blog-tags">';
        frontmatter.tags.forEach(tag => {
            headerHTML += `<span class="tag">#${tag}</span>`;
        });
        headerHTML += '</div>';
    }
    
    return headerHTML;
}

// Load markdown post and convert to HTML with dynamic template support
async function loadPost(filename) {
    const contentDiv = document.getElementById('blog-content');
    if (!contentDiv) return;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const markdown = await response.text();
        const { frontmatter, content } = parseFrontmatter(markdown);
        
        const converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            headerLevelStart: 2
        });
        
        const contentHTML = converter.makeHtml(content);
        const headerHTML = createBlogHeader(frontmatter);
        
        contentDiv.innerHTML = headerHTML + contentHTML;
        contentDiv.className = `blog-content ${frontmatter.layout || 'default'}`;
        
        // Scroll to content area after loading
        setTimeout(() => {
            contentDiv.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
    } catch (error) {
        contentDiv.innerHTML = `
            <h2>Error Loading Post</h2>
            <p>Sorry, the blog post could not be loaded. Please try again later.</p>
            <p>Error: ${error.message}</p>
        `;
    }
}

// Typing Animation
function initTypingAnimation() {
    const phrases = [
        "I strum melodies on my guitar 🎸",
        "I chase sunrises on mountain trails 🌄",
        "I dive into sci-fi worlds and futures 📚",
        "I capture nature's hidden stories 📸",
        "I brew the perfect cup of coffee ☕",
        "I explore new places and cultures 🗺️",
        "I sketch ideas that spark creativity ✏️"
    ];
    
    const typedTextElement = document.getElementById('typed-text');
    if (!typedTextElement) return;
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 80;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 1200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 300;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    initTheme();
    await loadAllPosts();
    renderPostsList();
    setupSearch();
    
    // Show welcome message instead of auto-loading post
    const contentDiv = document.getElementById('blog-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div style="text-align: left; padding: 3rem; color: var(--text-secondary);">
                <h2 style="color: var(--text-primary); margin-bottom: 2rem; font-size: 2.5rem; font-weight: 700; font-family: 'Poppins', sans-serif;">Welcome to My Blog</h2>
                <p style="font-size: 1.2rem; margin-bottom: 2rem; color: var(--text-primary);"> Dive into any story above and let the journey begin!</p>
                <p style="font-size: 1rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 2rem;"> Hunt for treasures using the search bar — explore by title or tags</p>
                
                <div class="typing-container">
                    <h3>Away From the Keyboard…</h3>
                    <div class="typing-text">
                        <span id="typed-text"></span>
                        <span class="typing-cursor"></span>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize typing animation after DOM is updated
        setTimeout(initTypingAnimation, 100);
    }
});
