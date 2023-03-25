export interface DictionaryEntry {
    word: string;
    phonetic: string;
    phonetics: {
      text: string;
      audio: string;
      sourceUrl: string;
      license: {
        name: string;
        url: string;
      };
    }[];
    meanings: {
      partOfSpeech: string;
      definitions: {
        definition: string;
        synonyms: string[];
        antonyms: string[];
        example: string;
      }[];
      synonyms: string[];
      antonyms: string[];
    }[];
    license: {
      name: string;
      url: string;
    };
    sourceUrls: string[];
  }

export function getFreeDefinition(word) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
}