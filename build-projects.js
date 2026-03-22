const fs = require('fs');
const path = require('path');

const categories = { '3d': '3D', 'design': 'Design', 'it': 'IT' };
const baseDir = path.join(__dirname, 'Projects');
const fallbackData = {};

Object.entries(categories).forEach(([key, folderName]) => {
    const targetDir = path.join(baseDir, folderName);
    let projects = [];

    if (fs.existsSync(targetDir)) {
        const categoryDisabled = fs.existsSync(path.join(targetDir, 'OFF'));
        const items = fs.readdirSync(targetDir, { encoding: 'utf8' });
        for (const item of items) {
            const itemPath = path.join(targetDir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                let files = fs.readdirSync(itemPath, { encoding: 'utf8' }).filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.webm'].includes(ext);
                });

                // Sort slides by number prefix if available
                files.sort((a, b) => {
                    const numA = parseInt(a.match(/^\d+/)) || 9999;
                    const numB = parseInt(b.match(/^\d+/)) || 9999;
                    return numA - numB || a.localeCompare(b);
                });

                if (files.length > 0) {
                    const isProjectDisabled = categoryDisabled || fs.existsSync(path.join(itemPath, 'OFF'));
                    projects.push({ folder: item, files, disabled: isProjectDisabled });
                }
            }
        }
    }

    // Sort projects in inverse order (highest number prefix first) — matches PHP API
    projects.sort((a, b) => {
        const numA = parseInt(a.folder.match(/^\d+/)) || -1;
        const numB = parseInt(b.folder.match(/^\d+/)) || -1;
        if (numA !== numB) return numB - numA;
        return a.folder.localeCompare(b.folder);
    });
    fallbackData[key] = projects;
});

// Write to api folder
const outPath = path.join(__dirname, 'api', 'projects-fallback.json');
fs.writeFileSync(outPath, JSON.stringify(fallbackData, null, 2), 'utf-8');
console.log('✅ Generated fallback projects JSON for local static testing.');
