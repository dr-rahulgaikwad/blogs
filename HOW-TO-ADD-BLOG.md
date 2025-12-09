# How to Add a New Blog Post (Simple as Medium!)

## Quick Start - 3 Steps Only!

### Step 1: Create Your Blog File
Go to GitHub → `posts/` folder → Click "Add file" → "Create new file"

Name it: `my-awesome-blog.md`

### Step 2: Write Your Content
```markdown
# My Awesome Blog Title

This is my introduction paragraph. It will automatically become the description.

## What I Learned Today

Write your content here...

## Key Takeaways

- Point 1
- Point 2

## Conclusion

Final thoughts...
```

### Step 3: Commit & Push
Click "Commit changes" → Done!

---

## What Happens Automatically?

✅ **Title** - Extracted from your `# Heading`  
✅ **Date** - Set to today's date  
✅ **Read Time** - Calculated from word count (200 words/min)  
✅ **Description** - First paragraph (150 chars)  
✅ **Author** - "Dr. Rahul Gaikwad"  
✅ **Sorting** - Newest blog appears at the top  
✅ **Index** - Updated in `posts-index.json`  

**GitHub Actions runs automatically and handles everything!**

---

## Optional: Custom Metadata

Want to add tags or custom description? Add frontmatter at the top:

```markdown
---
tags: ["aws", "terraform", "devops"]
description: "Custom description here"
---

# Your Blog Title

Content starts here...
```

---

## Examples

### Minimal Blog (Auto-everything)
```markdown
# Getting Started with Terraform

Terraform is an amazing tool for infrastructure as code...

## Installation

First, download Terraform...
```

### Blog with Tags
```markdown
---
tags: ["terraform", "aws", "iac"]
---

# Advanced Terraform Patterns

In this post, I'll share advanced patterns...
```

---

## Verification

After pushing:
1. Wait 1-2 minutes for GitHub Actions to complete
2. Visit your blog site
3. Your new blog will be at the top!

---

## Troubleshooting

**Blog not appearing?**
- Check GitHub Actions tab for errors
- Ensure file is in `posts/` folder
- Verify file ends with `.md`
- Clear browser cache (Ctrl+Shift+R)

**Wrong read time?**
- System calculates: word count ÷ 200 = minutes
- Manually set: Add `readTime: "10 min"` in frontmatter

**Wrong date?**
- Manually set: Add `date: "2025-02-10"` in frontmatter

---

## That's It!

No complex setup. No manual metadata. Just write and publish! 🚀
