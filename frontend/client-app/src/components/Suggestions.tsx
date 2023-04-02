import { Box, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
    const debouncedSearch = useDebounce(word, 1500);
    const [translationResults, setTranslationResults] = useState<string[]>([]);
    const [isInProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (debouncedSearch) {
            setInProgress(true);
            myFetch("service-translation/translate", "POST", { text: word, from: "en", to: "uk" })
                .then((res: TranslationObject[]) => {
                    console.log(res);
                    setTranslationResults(res[0].translations.map(el => el.text));
                })
                .finally(() => setInProgress(false));
        }
    }, [debouncedSearch]);

    if (!translationResults.length) {
        return null
    }

    return (
        <Box sx={{ p: 2, textAlign: "left", width: 1 }}>
            { isInProgress && <Typography variant="body2">Loading...</Typography> }
            { !isInProgress && translationResults.map(el => <Chip key={el} label={el} onClick={() => onTranslationPressed(word, el)} />) }
        </Box>
    )
}

export default Suggestions;
