#!/usr/bin/env python3
import json
import os

def convert_translation_file(input_file, output_file, translator_name):
    """Convert translation text file to JSON format"""
    translations = []
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('#') or '----' in line:
                continue
                
            # Parse format: surah|verse|text
            parts = line.split('|', 2)
            if len(parts) >= 3:
                try:
                    surah = int(parts[0])
                    verse = int(parts[1])
                    text = parts[2].strip()
                    
                    translations.append({
                        "surah": surah,
                        "verse": verse,
                        "text": text,
                        "translator": translator_name
                    })
                except ValueError:
                    print(f"Skipping invalid line: {line}")
                    continue
        
        # Write to JSON file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        
        print(f"Converted {len(translations)} verses to {output_file}")
        return True
        
    except FileNotFoundError:
        print(f"File {input_file} not found")
        return False
    except Exception as e:
        print(f"Error converting {input_file}: {e}")
        return False

def main():
    # Convert main Arabic Quran
    if os.path.exists('quran.txt'):
        convert_translation_file(
            'quran.txt',
            'src/json/arabic.json',
            'Arabic'
        )
    
    # Convert English translation
    if os.path.exists('translations/en.sahih.txt'):
        convert_translation_file(
            'translations/en.sahih.txt',
            'src/json/en.sahih.json',
            'Sahih International'
        )
    
    # Convert Urdu translation
    if os.path.exists('translations/ur.maududi.txt'):
        convert_translation_file(
            'translations/ur.maududi.txt',
            'src/json/ur.maududi.json',
            'Maududi'
        )
    
    print("All conversions completed!")

if __name__ == "__main__":
    main()