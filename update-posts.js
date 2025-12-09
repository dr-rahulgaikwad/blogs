#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const indexFile = path.join(postsDir, 'posts-index.json');

// Calculate read time (avg 200 words/min)
function calculateReadTime(content) {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
}

// Extract title from content or filename
function extractTitle(content, filename) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) return h1Match[1];
    return filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Extract description from content
function extractDescription(content) {
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    const firstPara = lines.find(l => l.length > 50);
    return firstPara ? firstPara.substring(0, 150) + '...' : 'No description available';
}

// Auto-generate or update frontmatter
function processFrontmatter(content, filename) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    let frontmatter = {};
    let bodyContent = content;
    
    if (match) {
        const fmText = match[1];
        bodyContent = match[2];
        fmText.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
                }
                frontmatter[key] = value;
            }
        });
    }
    
    // Auto-fill missing fields
    if (!frontmatter.title) frontmatter.title = extractTitle(bodyContent, filename);
    if (!frontmatter.date) frontmatter.date = new Date().toISOString().split('T')[0];
    if (!frontmatter.description) frontmatter.description = extractDescription(bodyContent);
    if (!frontmatter.tags) frontmatter.tags = [];
    if (!frontmatter.author) frontmatter.author = 'Dr. Rahul Gaikwad';
    if (!frontmatter.readTime) frontmatter.readTime = calculateReadTime(bodyContent);
    
    // Build new frontmatter
    let newFrontmatter = '---\n';
    newFrontmatter += `title: "${frontmatter.title}"\n`;
    newFrontmatter += `date: "${frontmatter.date}"\n`;
    newFrontmatter += `description: "${frontmatter.description}"\n`;
    newFrontmatter += `tags: [${Array.isArray(frontmatter.tags) ? frontmatter.tags.map(t => `"${t}"`).join(', ') : ''}]\n`;
    newFrontmatter += `author: "${frontmatter.author}"\n`;
    newFrontmatter += `readTime: "${frontmatter.readTime}"\n`;
    newFrontmatter += '---\n\n';
    
    return { updated: newFrontmatter + bodyContent, frontmatter };
}

try {
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const postsData = [];
    
    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { updated, frontmatter } = processFrontmatter(content, file);
        
        // Update file with complete frontmatter
        fs.writeFileSync(filePath, updated);
        
        postsData.push({
            file,
            date: frontmatter.date,
            title: frontmatter.title
        });
    });
    
    // Sort by date DESC (newest first)
    postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    const sortedFiles = postsData.map(p => p.file);
    
    fs.writeFileSync(indexFile, JSON.stringify(sortedFiles, null, 2));
    
    console.log(`✅ Updated ${files.length} posts with auto-generated metadata:`);
    postsData.forEach(p => console.log(`   📅 ${p.date} - ${p.title}`));
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}