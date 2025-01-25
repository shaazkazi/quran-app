import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Select,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import arabicQuran from '../json/arabic.json';
import englishQuran from '../json/en.sahih.json';
import urduQuran from '../json/ur.maududi.json';

function QuranReader() {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [selectedTranslations, setSelectedTranslations] = useState(['ar', 'en']);
  
  const translations = {
    ar: { data: arabicQuran, name: 'Arabic' },
    en: { data: englishQuran, name: 'English' },
    ur: { data: urduQuran, name: 'Urdu' }
  };

  const getCurrentSurahVerses = (translation) => {
    return translation.data.filter(verse => verse.surah === currentSurah);
  };

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Box>
          <Select 
            value={currentSurah} 
            onChange={(e) => setCurrentSurah(Number(e.target.value))}
          >
            {[...Array(114)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Surah {idx + 1}
              </option>
            ))}
          </Select>
        </Box>
        <HStack>
          {Object.entries(translations).map(([key, { name }]) => (
            <Button
              key={key}
              colorScheme={selectedTranslations.includes(key) ? 'teal' : 'gray'}
              onClick={() => {
                setSelectedTranslations(prev =>
                  prev.includes(key)
                    ? prev.filter(t => t !== key)
                    : [...prev, key]
                );
              }}
            >
              {name}
            </Button>
          ))}
        </HStack>
      </HStack>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {selectedTranslations.map(lang => (
          <Box
            key={lang}
            bg="white"
            p={6}
            rounded="lg"
            shadow="md"
            borderWidth="1px"
          >
            <Heading size="md" mb={4}>
              {translations[lang].name}
            </Heading>
            <VStack align="stretch" spacing={4}>
              {getCurrentSurahVerses(translations[lang]).map(verse => (
                <Box
                  key={verse.verse}
                  p={4}
                  bg="gray.50"
                  rounded="md"
                  borderWidth="1px"
                >
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {verse.verse}
                  </Text>
                  <Text
                    fontSize={lang === 'ar' ? 'xl' : 'md'}
                    textAlign={lang === 'ar' ? 'right' : 'left'}
                  >
                    {verse.text}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
}

export default QuranReader;
