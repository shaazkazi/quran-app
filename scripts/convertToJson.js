import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertToJson(filePath, language, translator) {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    const verses = lines.map(line => {
        // Split by first two pipe characters
        const parts = line.split('|', 3);
        const surah = parseInt(parts[0]);
        const verse = parseInt(parts[1]);
        const text = parts[2];
        
        return {
            surah,
            verse,
            text,
            language,
            translator
        };
    });

    return verses;
}

// Convert Arabic Quran
const arabicQuran = convertToJson('./quran.txt', 'ar', 'original');
writeFileSync('./src/json/arabic.json', JSON.stringify(arabicQuran, null, 2));

// Convert English translation
const englishQuran = convertToJson('./translations/en.sahih.txt', 'en', 'Saheeh International');
writeFileSync('./src/json/en.sahih.json', JSON.stringify(englishQuran, null, 2));

// Convert Urdu translation
const urduQuran = convertToJson('./translations/ur.maududi.txt', 'ur', "Abul A'ala Maududi");
writeFileSync('./src/json/ur.maududi.json', JSON.stringify(urduQuran, null, 2));
