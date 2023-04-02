import { Box, Chip, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";


import { DictionaryEntry, getFreeDefinition } from "../utils/freeDictionary";
import useFetch from "../hooks/useFetch";

interface TranslationObject {
    translations: {
        text: string;
        to: string;
    }[]
}


interface SuggestionsProps {
    word: string;
    onTranslationPressed: (word: string, translation: string) => void;
}

const Suggestions = ({ word, onTranslationPressed }: SuggestionsProps) => {
    const myFetch = useFetch();
    const previousController = useRef<AbortController>();
    const debouncedSearch = useDebounce(word, 1000);
    const [translationResults, setTranslationResults] = useState<string[]>([]);
    const [freeDefinitions, setFreeDefinitions] = useState<DictionaryEntry[]>([]);
    const [isInProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (debouncedSearch) {
            if (previousController.current) {
                previousController.current.abort();
            }
            const abortController = new AbortController();
            previousController.current = abortController;
            setInProgress(true);
            myFetch({ 
                route: "service-translation/translate", 
                method: "POST", 
                body: { text: word, from: "en", to: "uk" },
                abortController,
            })
            .then((res: TranslationObject[]) => {
                setTranslationResults(res[0].translations.map(el => el.text));
             })
            .finally(() => setInProgress(false));

            getFreeDefinition(debouncedSearch, previousController?.current)
                .then(res => setFreeDefinitions(res))
             
        }
    }, [debouncedSearch]);

    const showLoading = isInProgress || word !== debouncedSearch || translationResults.length === 0;

    return (
        <Box sx={{ p: 2, textAlign: "left", width: 1, display: "flex" }}>
            { showLoading && <CircularProgress size={30} sx={{ mr: 1 }}/> }
            
            { !showLoading && translationResults.map((el, i) => ( 
                // eslint-disable-next-line react/no-array-index-key
                <Chip key={el + i} label={el} onClick={() => onTranslationPressed(word, el)} sx={{ mr: 1 }} />
            ))}
            { freeDefinitions?.slice(0, 1)?.map((def, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Chip key={def.word + i} label={`Definition: ${def.word} ${def.phonetic ? `[${def.phonetic}]` : ""}`} color="secondary" sx={{ mr: 1 }} />
            ))}
        </Box>
    )
}

export default Suggestions;
