const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.match(/\.(js|jsx|css|html)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<<<<<<< HEAD')) {
                // Regex to match the conflict blocks and keep the HEAD part
                const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [A-Za-z0-9_/-]+\r?\n/g;
                const newContent = content.replace(regex, '$1');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    });
}
processDir(path.join(__dirname, 'src'));
