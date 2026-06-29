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
    
    // Fix deep imports (../../ -> ../../../)
    // We only want to replace it for things going outside the Screens directory, which are 2 levels up originally (Screens/Auth/LoginScreen.jsx -> ../../context)
    // Now it's Screens/Auth/LoginScreen/LoginScreen.jsx -> ../../../context
    content = content.replace(/from\s+['"]\.\.\/\.\.\/(services|context|hooks|Components|config)/g, "from '../../../$1");
    content = content.replace(/import\s+['"]\.\.\/\.\.\/(services|context|hooks|Components|config)/g, "import '../../../$1");
    
    // Fix CSS imports
    // AuthScreens.css is in Auth/
    content = content.replace(/import\s+['"]\.\/AuthScreens\.css['"]/g, "import '../AuthScreens.css'");
    
    // AdminTables.css is in Admin/AdminTables/
    content = content.replace(/import\s+['"]\.\/AdminTables\.css['"]/g, "import '../AdminTables/AdminTables.css'");
    
    // FormLayout.css is in Admin/FormLayout/
    content = content.replace(/import\s+['"]\.\/FormLayout\.css['"]/g, "import '../FormLayout/FormLayout.css'");

    // Any other CSS import that was ./Something.css and is now in the same folder ./Something.css should be fine if they were moved together.
    // e.g. LoginScreen.css -> LoginScreen/LoginScreen.css, so ./LoginScreen.css is correct.

    // ConfirmModal is a component, so it goes to ../../../Components
    content = content.replace(/from\s+['"]\.\.\/\.\.\/Components/g, "from '../../../Components");
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file}`);
});
