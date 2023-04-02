import { Box, Chip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";


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
        }
    }, [debouncedSearch]);

    const showLoading = isInProgress || word !== debouncedSearch || translationResults.length === 0;

    return (
        <Box sx={{ p: 2, textAlign: "left", width: 1 }}>
            { showLoading && <Typography variant="body2">...</Typography> }
            { !showLoading && translationResults.map(el => <Chip key={el} label={el} onClick={() => onTranslationPressed(word, el)} />) }
        </Box>
    )
}

export default Suggestions;
