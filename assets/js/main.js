// Blog posts data with tags - sorted by date DESC
// TO ADD NEW BLOG: Add entry here with matching .md file
const posts = [
    // {
    //     title: "Your New Blog Title",
    //     file: "your-new-blog.md",
    //     date: "2024-02-10",
    //     description: "Brief description for the card",
    //     tags: ["tag1", "tag2", "tag3"]
    // },
    {
        title: "Building Scalable AWS Cloud Architecture",
        file: "aws-cloud-architecture.md",
        date: "2024-02-05",
        description: "Learn how to design and implement scalable cloud architectures on AWS using best practices.",
        tags: ["aws", "cloud", "architecture", "devops"]
    },
    {
        title: "My Journey from Beginner to Cloud Architect",
        file: "my-coding-journey.md",
        date: "2024-02-01",
        description: "A personal reflection on my coding journey, challenges faced, and lessons learned.",
        tags: ["personal", "career", "journey", "motivation"]
    },
    {
        title: "Web Development Best Practices",
        file: "web-dev-practices.md",
        date: "2024-01-25",
        description: "Essential practices and patterns for building modern, scalable web applications.",
        tags: ["web-development", "best-practices", "tips"]
    },
    {
        title: "Getting Started with JavaScript",
        file: "javascript-basics.md",
        date: "2024-01-20",
        description: "A comprehensive guide to JavaScript fundamentals for beginners.",
        tags: ["javascript", "programming", "tutorial"]
    },
    {
        title: "Welcome to My Blog",
        file: "example-blog.md",
        date: "2024-01-15",
        description: "My first blog post introducing myself and sharing my journey.",
        tags: ["introduction", "personal", "blog"]
    }
].sort((a, b) => new Date(b.date) - new Date(a.date));

// STEPS TO ADD NEW BLOG:
// 1. Create your-blog-name.md file in /posts/ folder
// 2. Add YAML frontmatter with tags: ["tag1", "tag2"]
// 3. Add entry to posts array above
// 4. Tags will appear in both card view and blog header

// Typing animation
const typingText = document.getElementById('typing-text');
if (typingText) {
    const phrases = [
        "Welcome to my digital space",
        "Sharing knowledge and insights",
        "Exploring technology and beyond"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 75 : 120;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 800;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
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
    
    postsContainer.innerHTML = '';
    
    if (postsToRender.length === 0) {
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
        
        // Add click event to load post
        postElement.addEventListener('click', () => loadPost(post.file));
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderPostsList();
    setupSearch();
    
    // Load first post by default
    if (posts.length > 0) {
        setTimeout(() => loadPost(posts[0].file), 1000);
    }
});