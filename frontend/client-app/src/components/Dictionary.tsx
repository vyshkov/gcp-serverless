import {
    enqueueSnackbar 
} from 'notistack';

import {
    Backdrop,
    Box, 
    CircularProgress, 
    IconButton, 
    InputAdornment, 
    ListItemIcon, 
    ListItemText, 
    Menu, 
    MenuItem, 
    OutlinedInput,
} from '@mui/material';

import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { AddWordsDialog } from './AddWordDialog';
import useFetch from '../hooks/useFetch';

import Suggestions from './Suggestions';


import { DictionaryEntry } from '../utils/freeDictionary';
import { FreeDictionaryDialog } from './FreeDictionaryDialog';
import { TableContent } from './TableContent';
import { UrbanDictionaryDialog } from './UrbanDictionaryDialog';
import { UrbanDictionaryEntry } from '../utils/urbanDictionary';
import { Word } from '../types';

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export const Dictionary = () => {
    const myFetch = useFetch();
    const [search, setSearch] = useState("");
    const [autoTranslation, setAutoTranslation] = useState("");
    const [words, setWords] = useState<Word[]>([]);
    const [isWordDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [urbanDictionaryDefinitions, setUrbanDictionaryDefinitions] = useState<UrbanDictionaryEntry[]>([]);
    const [freeDictionaryDefinitions, setFreeDictionaryDefinitions] = useState<DictionaryEntry[]>([]);

    const [selected, setSelected] = useState<Word | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
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
        return myFetch({ route: "service-dictionary" })
            .then(words => setWords(words.sort((a: Word, b: Word) => b.lastUpdated - a.lastUpdated)))
            .catch(() => enqueueSnackbar("Failed to load words", { variant: "error" }))
            .finally(() => setIsUpdating(false));
    }

    const deleteWord = () => {
        if (selected) {
            setIsUpdating(true);
            myFetch({ route: `service-dictionary/${selected.id}`, method: "DELETE" })
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
            { search?.length > 2 && filteredWords.length === 0 && (
                <Suggestions 
                    word={search} 
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
                handleClickListItem={handleClickListItem}
            />
            
            <Menu
                open={contextMenu !== null}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }

                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                <MenuItem
                    onClick={deleteWord}
                    disabled={isUpdating}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem
                    disabled
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
            </Menu>
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
        </Stack>
    );
}

export default Dictionary;