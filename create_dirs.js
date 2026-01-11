
// This file is temporary to ensure directories exist because mkdir command failed
import fs from 'fs';
import path from 'path';

const dirs = [
    'src/pages/home',
    'src/pages/mentoria/ia',
    'src/pages/mentoria/gestao-de-escritorio'
];

dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created ${fullPath}`);
    }
});
