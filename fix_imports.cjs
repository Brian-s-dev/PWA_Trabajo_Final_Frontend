const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'Screens');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const jsxFiles = walk(screensDir);

jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/from\s+['"]\.\.\/\.\.\/(services|context|hooks|Components|config)/g, "from '../../../$1");
    content = content.replace(/import\s+['"]\.\.\/\.\.\/(services|context|hooks|Components|config)/g, "import '../../../$1");
    
    content = content.replace(/import\s+['"]\.\/AuthScreens\.css['"]/g, "import '../AuthScreens.css'");
    
    content = content.replace(/import\s+['"]\.\/AdminTables\.css['"]/g, "import '../AdminTables/AdminTables.css'");
    
    content = content.replace(/import\s+['"]\.\/FormLayout\.css['"]/g, "import '../FormLayout/FormLayout.css'");


    content = content.replace(/from\s+['"]\.\.\/\.\.\/Components/g, "from '../../../Components");
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file}`);
});
