// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = '';
    }
}

// Auto-discovery of blog posts
let posts = [];

// Load posts dynamically from posts-index.json
async function loadPostsFromDirectory() {
    try {
        // Load the posts index
        const indexResponse = await fetch('posts/posts-index.json');
        if (!indexResponse.ok) {
            throw new Error('Failed to load posts index');
        }
        const knownPosts = await indexResponse.json();
        
        const loadedPosts = [];
        
        for (const filename of knownPosts) {
            try {
                const response = await fetch(`posts/${filename}`);
                if (response.ok) {
                    const content = await response.text();
                    const { frontmatter } = parseFrontmatter(content);
                    
                    const post = {
                        title: frontmatter.title || filename.replace('.md', '').replace(/-/g, ' '),
                        file: filename,
                        date: frontmatter.date || new Date().toISOString().split('T')[0],
                        description: frontmatter.description || frontmatter.summary || 'No description available',
                        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
                    };
                    
                    loadedPosts.push(post);
                }
            } catch (error) {
                console.log(`Could not load ${filename}:`, error);
            }
        }
        
        // Sort by date DESC
        posts = loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        return posts;
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

// TO ADD NEW BLOG:
// 1. Create your-blog-name.md file in /posts/ folder with frontmatter:
//    ---
//    title: "Your Blog Title"
//    date: "2024-02-10"
//    description: "Brief description"
//    tags: ["tag1", "tag2"]
//    ---
// 2. Add filename to knownPosts array above
// 3. Refresh page - it will auto-load!

// Hobby typing animation for terminal panel
function initHobbyTyping() {
    const hobbyText = document.getElementById('hobby-text');
    if (!hobbyText) return;
    
    const hobbies = [
        "Cloud Architecture 🏗️",
        "Terraform Modules 🔧",
        "Kubernetes Clusters ⚙️",
        "DevOps Automation 🚀",
        "AWS Solutions 📊"
    ];
    
    let hobbyIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeHobby() {
        const currentHobby = hobbies[hobbyIndex];
        
        if (isDeleting) {
            hobbyText.textContent = currentHobby.substring(0, charIndex - 1);
            charIndex--;
        } else {
            hobbyText.textContent = currentHobby.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentHobby.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            hobbyIndex = (hobbyIndex + 1) % hobbies.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeHobby, typeSpeed);
    }
    
    typeHobby();
}

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
    if (!postsContainer) return;
    
    // Show loading state
    postsContainer.innerHTML = '<div class="loading-state">Loading posts...</div>';
    
    // Simulate brief loading for better UX
    setTimeout(() => {
        postsContainer.innerHTML = '';
        
        if (postsToRender.length === 0) {
            postsContainer.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
            return;
        }
    
    postsToRender.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        
        // Create tags HTML with monospace styling
        const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
        
        postElement.innerHTML = `
            <h4 class="post-title">${post.title}</h4>
            <p class="post-date">📅 ${post.date}</p>
            <p class="post-description">${post.description}</p>
            <div class="post-tags">${tagsHTML}</div>
            <div class="read-more">Read →</div>
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
                        <a href="index.html" class="nav-link terminal-cmd">← back</a>
                    </div>
                    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                        <span class="sun-icon">☀️</span>
                        <span class="moon-icon">🌙</span>
                    </button>
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
    }, 100);
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
        console.error('Error loading post:', error);
        contentDiv.innerHTML = `
            <div class="error-panel">
                <h2>😔 Oops! Post Not Found</h2>
                <p>The blog post you're looking for couldn't be loaded. This might be a temporary issue.</p>
                <div class="error-actions">
                    <button onclick="window.location.reload()" class="cta-button">Try Again</button>
                    <a href="index.html" class="cta-button" style="margin-left: 10px;">Back to Blog</a>
                </div>
            </div>
        `;
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Code typing animation for hero section
function initCodeTyping() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;
    
    const codeWords = ['"Build"', '"Deploy"', '"Scale"', '"Automate"'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeCode() {
        const currentWord = codeWords[wordIndex];
        
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % codeWords.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeCode, typeSpeed);
    }
    
    typeCode();
}

// Scrolling quotes animation
function initScrollingQuotes() {
    const quotesContainer = document.getElementById('scrolling-quotes');
    if (!quotesContainer) return;
    
    let currentIndex = 0;
    const quotes = quotesContainer.children;
    const totalQuotes = quotes.length;
    
    if (totalQuotes === 0) return;
    
    function scrollToNext() {
        currentIndex = (currentIndex + 1) % totalQuotes;
        const translateY = -currentIndex * 40; // 40px per quote (padding + height)
        quotesContainer.style.transform = `translateY(${translateY}px)`;
    }
    
    // Start scrolling after 2 seconds, then every 3 seconds
    setTimeout(() => {
        setInterval(scrollToNext, 3000);
    }, 2000);
}

// Chat functionality
function initChatButton() {
    const chatButton = document.getElementById('floating-chat');
    const chatPopup = document.getElementById('chat-popup');
    let isPopupVisible = false;
    
    if (!chatButton || !chatPopup) return;
    
    // Toggle wave animation every 5 seconds
    setInterval(() => {
        chatButton.classList.add('waving');
        setTimeout(() => {
            chatButton.classList.remove('waving');
        }, 600);
    }, 5000);
    
    // Click handler
    chatButton.addEventListener('click', () => {
        isPopupVisible = !isPopupVisible;
        
        if (isPopupVisible) {
            chatPopup.classList.add('show');
            chatButton.textContent = '💬';
        } else {
            chatPopup.classList.remove('show');
            chatButton.textContent = '👋';
        }
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatButton.contains(e.target) && !chatPopup.contains(e.target) && isPopupVisible) {
            isPopupVisible = false;
            chatPopup.classList.remove('show');
            chatButton.textContent = '👋';
        }
    });
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('div');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.title = 'Scroll to top';
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Click handler
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    initTheme();
    initCodeTyping();
    initHobbyTyping();
    
    // Load posts dynamically
    await loadPostsFromDirectory();
    renderPostsList();
    
    setupSearch();
    setupSmoothScrolling();
    initChatButton();
    initScrollToTop();

    // Show VS Code style welcome message
    const contentDiv = document.getElementById('blog-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="welcome-panel">
                <h2>🚀 Welcome to the Command Center</h2>
                <p>Select any blog above to begin reading, or use the search to find specific one.</p>
                <div id="quotes-container" style="margin-top: 2rem; padding: 1rem; background: var(--secondary-bg); border-radius: var(--radius-md); border-left: 4px solid var(--purple-primary); height: 60px; overflow: hidden;">
                    <div id="scrolling-quotes" style="font-style: italic; color: var(--text-secondary); margin: 0; transition: transform 0.5s ease;">
                        <p style="margin: 0; padding: 10px 0;">"Everything fails all the time." <span style="opacity: 0.7;">— Werner Vogels, AWS CTO</span></p>
                        <p style="margin: 0; padding: 10px 0;">"You build it, you run it." <span style="opacity: 0.7;">— Werner Vogels, AWS</span></p>
                        <p style="margin: 0; padding: 10px 0;">"There is no compression algorithm for experience." <span style="opacity: 0.7;">— Andy Jassy, AWS CEO</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Builders are never done building." <span style="opacity: 0.7;">— AWS</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Infrastructure as code enables you to treat your infrastructure like software." <span style="opacity: 0.7;">— HashiCorp</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Design for failure and nothing fails." <span style="opacity: 0.7;">— AWS Well-Architected</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Make it work, make it right, make it fast." <span style="opacity: 0.7;">— Kent Beck</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Simplicity is prerequisite for reliability." <span style="opacity: 0.7;">— Edsger Dijkstra</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Hope is not a strategy." <span style="opacity: 0.7;">— Google SRE</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Security is job zero." <span style="opacity: 0.7;">— AWS</span></p>
                        <p style="margin: 0; padding: 10px 0;">"The best code is no code at all." <span style="opacity: 0.7;">— Jeff Atwood</span></p>
                        <p style="margin: 0; padding: 10px 0;">"Automate everything you can." <span style="opacity: 0.7;">— Netflix Tech Blog</span></p>
                    </div>
                </div>
                <div style="margin-top: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted);">
                    <span style="color: var(--green-primary);">$</span> terraform plan && terraform apply
                </div>
            </div>
        `;
        
        // Initialize scrolling quotes after content is loaded
        setTimeout(() => {
            initScrollingQuotes();
        }, 100);
    }
});
