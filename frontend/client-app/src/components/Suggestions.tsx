import { Box, Button, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

import { DictionaryEntry, getFreeDefinition } from "../utils/freeDictionary";


const Suggestions = ({ word }: { word: string }) => {
    const debouncedSearch = useDebounce(word, 1500);
    const [freeDefinitions, setFreeDefinitions] = useState<DictionaryEntry[]>([]);
    const [, setInProgress] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (debouncedSearch) {
            setInProgress(true);
            getFreeDefinition(debouncedSearch)
                .then((res) => {
                    if (res.length) {
                        setFreeDefinitions(res);
                    } else {
                        setFreeDefinitions([]);
                    }
                })
                .finally(() => setInProgress(false));
        }
    }, [debouncedSearch]);

    if (!freeDefinitions.length) {
        return null
    }

    return (
        <Box sx={{ p: 3, backgroundColor: theme?.custom?.transparentLight, margin: 3, overflow: "hidden", width: 1, borderRadius: 1 }} >
            {freeDefinitions.map(def => (
                <Button disabled key={def.word + def.meanings[0].partOfSpeech} variant="outlined" sx={{ m: 1, textTransform: "none", width: 1 }}>
                    {def.word} [{def.phonetic}] {def.meanings?.map(m => m.definitions?.slice(0, 2).map(d => d.definition).join(", ")).join(" ")}
                </Button>
            ))}
        </Box>
    )
}

export default Suggestions;
