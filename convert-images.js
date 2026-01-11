import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/img';

// Basic WebP conversion
fs.readdir(dir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const inputFile = path.join(dir, file);
            const outputFile = path.join(dir, path.basename(file, ext) + '.webp');

            sharp(inputFile)
                .webp({ quality: 80 })
                .toFile(outputFile)
                .then(() => {
                    console.log(`Converted: ${file} -> ${path.basename(file, ext)}.webp`);
                })
                .catch(err => {
                    console.error(`Error converting ${file}:`, err);
                });
        }
    });
});
