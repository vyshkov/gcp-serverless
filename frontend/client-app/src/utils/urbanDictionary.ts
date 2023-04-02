export interface UrbanDictionaryEntry {
    definition: string;
    permalink: string;
    thumbs_up: number;
    sound_urls: string[];
    author: string;
    word: string;
    defid: number;
    current_vote: string;
    written_on: string;
    example: string;
    thumbs_down: number;
}

export function getUrbanDictionaryDefinition(word: string, previousController?: AbortController): Promise<UrbanDictionaryEntry[]> {
  return fetch(`https://api.urbandictionary.com/v0/define?term=${word}`, {
    signal: previousController?.signal,
  })
    .then((response) => response.json())
    .then((data) => data?.list || [])
}