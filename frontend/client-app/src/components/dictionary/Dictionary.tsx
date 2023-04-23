import {
    enqueueSnackbar 
} from 'notistack';

import {
    Backdrop,
    Box, 
    CircularProgress, 
    IconButton, 
    InputAdornment, 
    OutlinedInput,
} from '@mui/material';

import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { AddWordsDialog } from './AddWordDialog';

import Suggestions from './Suggestions';

import { DictionaryEntry } from '../../utils/freeDictionary';
import { FreeDictionaryDialog } from './FreeDictionaryDialog';
import { TableContent } from './TableContent';
import { UrbanDictionaryDialog } from './UrbanDictionaryDialog';
import { UrbanDictionaryEntry } from '../../utils/urbanDictionary';
import { Word } from '../../types';
import useClient from '../../hooks/useClient';

import { WordDetailsDialog } from './WordDetailsDialog';

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export const Dictionary = () => {
    const client = useClient();
    const [search, setSearch] = useState("");
    const [autoTranslation, setAutoTranslation] = useState("");
    const [words, setWords] = useState<Word[]>([]);
    const [isWordDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [urbanDictionaryDefinitions, setUrbanDictionaryDefinitions] = useState<UrbanDictionaryEntry[]>([]);
    const [freeDictionaryDefinitions, setFreeDictionaryDefinitions] = useState<DictionaryEntry[]>([]);

    const [selected, setSelected] = useState<Word | null>(null);

    const handleClose = () => {
        setAutoTranslation("");
        setSelected(null);
    };

    const handleAddWordOpen = () => {
        setIsDialogOpen(true);
    };

    const handleAddWordClose = () => {
        setSearch("");
        reload();
        setIsDialogOpen(false);
    };

    const reload = () => {
        setIsUpdating(true);
        return client.getAllWords()
            .then(setWords)
            .catch(() => enqueueSnackbar("Failed to load words", { variant: "error" }))
            .finally(() => setIsUpdating(false));
    }

    const deleteWord = () => {
        if (selected) {
            setIsUpdating(true);
            client.deleteWord(selected.id)
                .then(handleClose)
                .then(reload)
                .catch(() => enqueueSnackbar("Failed to delete word", { variant: "error" }))
                .finally(() => {
                    setIsUpdating(false)
                });
        } 
    }

    useEffect(() => {
        reload();
    }, []);

    const filteredWords = words.filter(el => wordMatchesSearch(el, search));

    return (
        <Stack sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", width: 1, padding: 0, minHeight: 0 }}>
            <Backdrop
                sx={{ color: '#fff' }}
                open={isUpdating}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ width: 1, px: 2, pt: 3 }}>
                <OutlinedInput
                    placeholder="Search..."
                    sx={{ width: 1 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={isUpdating}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                disabled={isUpdating}
                                onClick={handleAddWordOpen}
                                edge="end"
                            >
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>
            { search?.length > 2 && (
                <Suggestions 
                    word={search} 
                    translate={filteredWords.length === 0}
                    onUrbanDictionaryWordClick={setUrbanDictionaryDefinitions}
                    onFreeDictionaryWordClick={setFreeDictionaryDefinitions}
                    onTranslationPressed={(word, translation) => {
                        setAutoTranslation(translation);
                        handleAddWordOpen();
                    }} 
                />
            )}
            <TableContent
                words={filteredWords}
                selected={selected}
                setSelected={setSelected}
            />
            <AddWordsDialog
                open={isWordDialogOpen}
                handleClose={handleAddWordClose}
                search={selected?.word || search}
                autoTranslation={selected?.translation || autoTranslation}
            />
            <UrbanDictionaryDialog 
                definitions={urbanDictionaryDefinitions}
                handleClose={() => setUrbanDictionaryDefinitions([])}
            />
            <FreeDictionaryDialog
                definitions={freeDictionaryDefinitions}
                handleClose={() => setFreeDictionaryDefinitions([])}
            />
            <WordDetailsDialog
                deleteWord={deleteWord}
                word={selected || null}
                handleClose={handleClose}
                onUrbanDictionaryWordClick={setUrbanDictionaryDefinitions}
                onFreeDictionaryWordClick={setFreeDictionaryDefinitions}
            />
        </Stack>
    );
}

export default Dictionary;