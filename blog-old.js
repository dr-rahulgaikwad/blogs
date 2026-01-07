#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';
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
    // Look for first # heading
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : 'Untitled Blog Post';
}

function generateDescription(content) {
    // Remove frontmatter, headings, images, and get first paragraph
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
    
    // Common tech keywords
    const keywords = {
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
        'architecture': ['architecture', 'design', 'patterns', 'scalable']
    };
    
    for (const [tag, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            tags.push(tag);
        }
    }
    
    return tags.length > 0 ? tags.slice(0, 5) : ['blog', 'tech'];
}

function addFrontmatter(filename) {
    try {
        const blogPath = path.join(POSTS_DIR, filename);
        let content = fs.readFileSync(blogPath, 'utf8');
        
        // Check if frontmatter already exists
        if (content.startsWith('---')) {
            console.log('📝 Frontmatter already exists');
            return content;
        }
        
        // Generate frontmatter
        const title = extractTitle(content);
        const description = generateDescription(content);
        const tags = extractTags(content);
        const readTime = calculateReadTime(content);
        const date = new Date().toISOString().split('T')[0];
        
        const frontmatter = `---
title: "${title}"
date: "${date}"
description: "${description}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
author: "Dr. Rahul Gaikwad"
readTime: "${readTime}"
---

`;
        
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

        // Add frontmatter automatically
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