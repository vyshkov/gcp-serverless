import { Box, Chip, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";


import { DictionaryEntry, getFreeDefinition } from "../../utils/freeDictionary";
import { UrbanDictionaryEntry, getUrbanDictionaryDefinition } from "../../utils/urbanDictionary";

import useFetch from "../../hooks/useFetch";

interface TranslationObject {
    translations: {
        text: string;
        to: string;
    }[]
}


interface SuggestionsProps {
    word: string;
    translate: boolean;
    onTranslationPressed: (word: string, translation: string) => void;
    onUrbanDictionaryWordClick: (definitions: UrbanDictionaryEntry[]) => void;
    onFreeDictionaryWordClick: (definitions: DictionaryEntry[]) => void;
}

const Suggestions = ({ 
    word, 
    translate,
    onTranslationPressed, 
    onUrbanDictionaryWordClick, 
    onFreeDictionaryWordClick 
}: SuggestionsProps) => {
    const myFetch = useFetch();
    const previousController = useRef<AbortController>();
    const debouncedSearch = useDebounce(word, 1000);
    const [translationResults, setTranslationResults] = useState<string[]>([]);
    const [freeDefinitions, setFreeDefinitions] = useState<DictionaryEntry[]>([]);
    const [urbanDictionaryDefinitions, setUrbanDictionaryDefinitions] = useState<UrbanDictionaryEntry[]>([]);
    const [isInProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (debouncedSearch) {
            if (previousController.current) {
                previousController.current.abort();
            }
            const abortController = new AbortController();
            previousController.current = abortController;

            if (translate) {
                const isEnglish = /^[a-zA-Z\s-]+$/.test(word);

                setInProgress(true);
                myFetch({ 
                    route: "service-translation/translate", 
                    method: "POST", 
                    body: { text: word, from: isEnglish ? "en" : "uk", to: isEnglish ? "uk" : "en" },
                    abortController,
                })
                .then((res: TranslationObject[]) => {
                    setTranslationResults(res[0].translations.map(el => el.text));
                 })
                .finally(() => setInProgress(false));
            }

            getFreeDefinition(debouncedSearch, previousController?.current)
                .then(res => setFreeDefinitions(res));
            
            getUrbanDictionaryDefinition(debouncedSearch, previousController?.current)
                .then(res => setUrbanDictionaryDefinitions(res));
        }
    }, [debouncedSearch]);

    const showLoading = isInProgress || word !== debouncedSearch || translationResults.length === 0;

    return (
        <Box sx={{ p: 2, textAlign: "left", width: 1, display: "flex", flexWrap: "wrap" }}>
            {translate && showLoading && <CircularProgress size={30} sx={{ mr: 1 }} />}

            {translate && !showLoading && translationResults.map((el, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Chip key={el + i} label={el} onClick={() => onTranslationPressed(word, el)} 
                    sx={{ mr: 1, mb: 1 }} />
            ))}
            {freeDefinitions?.slice(0, 1)?.map((def, i) => (
                <Chip 
                    // eslint-disable-next-line react/no-array-index-key
                    key={def.word + i} 
                    label={`Definition: ${def.word} ${def.phonetic ? `[${def.phonetic}]` : ""}`} 
                    color="secondary" 
                    onClick={() => onFreeDictionaryWordClick(freeDefinitions)}
                    sx={{ mr: 1, mb: 1 }} 
                />
            ))}

            {
                urbanDictionaryDefinitions?.slice(0, 1)?.map((def, i) => (
                    <Chip 
                        // eslint-disable-next-line react/no-array-index-key
                        key={def.word + i} 
                        label={`Urban Dictionary: ${def.word}`} 
                        color="info" 
                        onClick={() => onUrbanDictionaryWordClick(urbanDictionaryDefinitions)}
                        sx={{ mr: 1, mb: 1 }} 
                    />
                ))
            }
        </Box>
    )
}

export default Suggestions;
