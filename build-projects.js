const fs = require('fs');
const path = require('path');

const categories = { '3d': '3D', 'design': 'Design', 'it': 'IT' };
const baseDir = path.join(__dirname, 'Projects');
const fallbackData = {};

Object.entries(categories).forEach(([key, folderName]) => {
    const targetDir = path.join(baseDir, folderName);
    let projects = [];

    if (fs.existsSync(targetDir)) {
        const items = fs.readdirSync(targetDir, { encoding: 'utf8' });
        for (const item of items) {
            const itemPath = path.join(targetDir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                const files = fs.readdirSync(itemPath, { encoding: 'utf8' }).filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.webm'].includes(ext);
                }).sort();

                if (files.length > 0) {
                    projects.push({ folder: item, files });
                }
            }
        }
    }

    projects.sort((a, b) => a.folder.localeCompare(b.folder));
    fallbackData[key] = projects;
});

// Write to api folder
const outPath = path.join(__dirname, 'api', 'projects-fallback.json');
fs.writeFileSync(outPath, JSON.stringify(fallbackData, null, 2), 'utf-8');
console.log('✅ Generated fallback projects JSON for local static testing.');
