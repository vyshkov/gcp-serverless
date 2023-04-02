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

export function getFreeDefinition(word: string, previousController?: AbortController): Promise<DictionaryEntry[]> {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
    signal: previousController?.signal,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.title === 'No Definitions Found') {
        return [];
      }
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}