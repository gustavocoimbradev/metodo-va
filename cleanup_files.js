
import fs from 'fs';
import path from 'path';

const files = [
    'src/App.jsx',
    'src/MentoriaIA.jsx',
    'src/MentoriaJovana.jsx'
];

files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted ${fullPath}`);
    }
});
