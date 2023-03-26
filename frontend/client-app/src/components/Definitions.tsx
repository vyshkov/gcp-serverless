import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

import { DictionaryEntry, getFreeDefinition } from "../utils/freeDictionary";


const Definitions = ({ word }: { word: string }) => {
    const debouncedSearch = useDebounce(word, 1500);
    const [freeDefinitions, setFreeDefinitions] = useState<DictionaryEntry[]>([]);
    const [inProgress, setInProgress] = useState(false);
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

    return (
        <Box sx={{ p: 3, flex: 1, backgroundColor: theme?.custom?.transparentLight, margin: 3, overflow: "auto", width: 1, borderRadius: 1, minHeight: 0, position: "relative" }} >
            {inProgress && ( 
                <Box 
                    sx={{ 
                        color: '#fff', 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: 1, 
                        height: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: "rgba(0,0,0,0.5)" 
                    }}
                >
                    <CircularProgress color="inherit" />
                </Box>
             )}
            {freeDefinitions.map(def => (
                <Button key={def.word + def.meanings[0].partOfSpeech} variant="outlined" sx={{ m: 1, textTransform: "none", width: 1 }}>
                    {def.word} [{def.phonetic}] {def.meanings?.map(m => m.definitions?.slice(0, 2).map(d => d.definition).join(", ")).join(" ")}
                </Button>
            ))}
            {freeDefinitions.length === 0 && word && (
                <Typography sx={{ textAlign: "center", pt: 2 }}>
                    No online definitions found for [{word}]
                </Typography>
            )}
            { !word && (
                <Typography sx={{ textAlign: "center", pt: 2 }}>
                    Start entering the word
                </Typography>
            )}
        </Box>
    )
}

export default Definitions;
