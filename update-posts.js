#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all .md files from posts directory
const postsDir = path.join(__dirname, 'posts');
const indexFile = path.join(postsDir, 'posts-index.json');

try {
    // Read all files in posts directory
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .sort();
    
    // Write to posts-index.json
    fs.writeFileSync(indexFile, JSON.stringify(files, null, 2));
    
    console.log(`✅ Updated posts index with ${files.length} posts:`);
    files.forEach(file => console.log(`   - ${file}`));
    
} catch (error) {
    console.error('❌ Error updating posts index:', error.message);
    process.exit(1);
}