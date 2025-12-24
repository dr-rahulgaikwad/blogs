#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';
const IMAGES_DIR = './images';
const INDEX_FILE = './posts/posts-index.json';

function calculateReadTime(content) {
    const cleanContent = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    const words = cleanContent.split(' ').filter(word => word.length > 0).length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min`;
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : 'Untitled Blog Post';
}

function generateDescription(content) {
    const cleanContent = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/^#+\s+.+$/gm, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/<img[^>]*>/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    const firstParagraph = cleanContent.split('\n\n')[0] || cleanContent.substring(0, 200);
    return firstParagraph.length > 150 ? firstParagraph.substring(0, 147) + '...' : firstParagraph;
}

function extractTags(content) {
    const tags = [];
    const text = content.toLowerCase();
    
    const keywords = {
        'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'chatgpt', 'gemini'],
        'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
        'terraform': ['terraform', 'hcl', 'infrastructure as code', 'iac'],
        'devops': ['devops', 'ci/cd', 'pipeline', 'deployment'],
        'cloud': ['cloud', 'serverless', 'microservices'],
        'docker': ['docker', 'container', 'containerization'],
        'kubernetes': ['kubernetes', 'k8s', 'kubectl', 'pods'],
        'python': ['python', 'django', 'flask', 'pandas'],
        'javascript': ['javascript', 'js', 'node', 'react', 'vue'],
        'automation': ['automation', 'scripting', 'workflow'],
        'security': ['security', 'compliance', 'encryption', 'auth'],
        'architecture': ['architecture', 'design', 'patterns', 'scalable'],
        'education': ['education', 'learning', 'teaching', 'student', 'teacher']
    };
    
    for (const [tag, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            tags.push(tag);
        }
    }
    
    return tags.length > 0 ? tags.slice(0, 5) : ['blog', 'tech'];
}

function createImageFolder(filename) {
    const blogName = filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const imageFolderPath = path.join(IMAGES_DIR, blogName);
    
    if (!fs.existsSync(imageFolderPath)) {
        fs.mkdirSync(imageFolderPath, { recursive: true });
        console.log(`📁 Created image folder: images/${blogName}/`);
    }
    
    return { blogName, imageFolderPath };
}

function processImages(content, blogName) {
    let imageCounter = 1;
    let updatedContent = content;
    
    // Process markdown images: ![alt](image.ext)
    updatedContent = updatedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        if (src.startsWith('http')) {
            return match; // Keep external URLs as-is
        }
        
        const newImageName = `${blogName}${String(imageCounter).padStart(2, '0')}.jpg`;
        const newImagePath = `images/${blogName}/${newImageName}`;
        imageCounter++;
        
        console.log(`🖼️  Renamed: ${src} → ${newImagePath}`);
        return `![${alt}](${newImagePath})`;
    });
    
    // Process HTML images: <img src="image.ext" ...>
    updatedContent = updatedContent.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/g, (match, before, src, after) => {
        if (src.startsWith('http')) {
            return match; // Keep external URLs as-is
        }
        
        const newImageName = `${blogName}${String(imageCounter).padStart(2, '0')}.jpg`;
        const newImagePath = `images/${blogName}/${newImageName}`;
        imageCounter++;
        
        console.log(`🖼️  Renamed: ${src} → ${newImagePath}`);
        return `<img${before}src="${newImagePath}"${after}>`;
    });
    
    return updatedContent;
}

function addFrontmatter(filename) {
    try {
        const blogPath = path.join(POSTS_DIR, filename);
        let content = fs.readFileSync(blogPath, 'utf8');
        
        if (content.startsWith('---')) {
            console.log('📝 Frontmatter already exists');
            return content;
        }
        
        // Create image folder and process images
        const { blogName } = createImageFolder(filename);
        content = processImages(content, blogName);
        
        // Generate frontmatter
        const title = extractTitle(content);
        const description = generateDescription(content);
        const tags = extractTags(content);
        const readTime = calculateReadTime(content);
        const date = new Date().toISOString().split('T')[0];
        
        const frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\ndescription: "${description}"\ntags: [${tags.map(tag => `"${tag}"`).join(', ')}]\nauthor: "Dr. Rahul Gaikwad"\nreadTime: "${readTime}"\n---\n\n`;
        
        const newContent = frontmatter + content;
        fs.writeFileSync(blogPath, newContent);
        
        console.log('✨ Auto-generated frontmatter:');
        console.log(`   Title: ${title}`);
        console.log(`   Tags: ${tags.join(', ')}`);
        console.log(`   Read time: ${readTime}`);
        
        return newContent;
    } catch (error) {
        console.error('❌ Error adding frontmatter:', error.message);
        return null;
    }
}

function addBlog(filename) {
    try {
        const blogPath = path.join(POSTS_DIR, filename);
        if (!fs.existsSync(blogPath)) {
            console.error(`❌ Blog file not found: ${filename}`);
            return false;
        }

        // Add frontmatter and process images automatically
        addFrontmatter(filename);

        // Read current index
        let postsIndex = [];
        if (fs.existsSync(INDEX_FILE)) {
            const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
            postsIndex = JSON.parse(indexContent);
        }

        // Add to beginning (latest first)
        if (!postsIndex.includes(filename)) {
            postsIndex.unshift(filename);
        }

        // Write updated index
        fs.writeFileSync(INDEX_FILE, JSON.stringify(postsIndex, null, 2));
        
        console.log(`✅ Blog "${filename}" is now live!`);
        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

const filename = process.argv[2];
if (!filename) {
    console.error('Usage: node blog.js filename.md');
    process.exit(1);
}

addBlog(filename);