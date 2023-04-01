import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import AddIcon from '@mui/icons-material/Add'

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
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { AddWordsDialog } from './AddWordDialog';
import useFetch from '../hooks/useFetch';

import Definitions from './Definitions';
import theme from '../themes/dark';

interface Word {
    id: string;
    word: string;
    translation: string;
    lastUpdated: number;
}

interface TableContentProps {
    words: Word[];
    selected: Word | null;
    setSelected: (w: Word | null) => void;
    handleClickListItem: (evt: React.MouseEvent<HTMLElement>) => void;
}

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export const TableContent = ({ 
    words, 
    selected, 
    setSelected, 
    handleClickListItem 
}: TableContentProps) => (
    words?.length === 0 ? (
        <Typography sx={{ textAlign: "center", pt: 2 }}>
            No saved words found
        </Typography>
    ) : (
        <TableContainer
            component={Paper}
            sx={{ px: 1, pt: 2, flex: 1, background: "transparent", boxShadow: "none", overflow: "auto" }}
        >
            <Table>
                <TableBody>
                    {words.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ 
                                '&:last-child td, &:last-child th': { border: 0 }, 
                                background: selected?.id === row.id ? theme.custom?.transparentMedium : "transparent" 
                            }}
                            onClick={(evt: React.MouseEvent<HTMLElement>) => {
                                handleClickListItem(evt);
                                setSelected(row);
                            }}
                        >
                            <TableCell component="th" scope="row" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
                                {row.word}
                            </TableCell>
                            <TableCell align="right">{row.translation}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
)

export const BasicTable = () => {
    const myFetch = useFetch();
    const [search, setSearch] = useState("");
    const [words, setWords] = useState<Word[]>([]);
    const [isWordDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

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
        return myFetch("service-dictionary", "GET")
            .then(words => setWords(words.sort((a: Word, b: Word) => b.lastUpdated - a.lastUpdated)))
            .catch(() => enqueueSnackbar("Failed to load words", { variant: "error" }))
            .finally(() => setIsUpdating(false));
    }

    const deleteWord = () => {
        if (selected) {
            setIsUpdating(true);
            myFetch(`service-dictionary/${selected.id}`, "DELETE")
                .then(handleClose)
                .then(reload)
                .catch(() => enqueueSnackbar("Failed to delete word", { variant: "error" }))
                .finally(() => {
                    setIsUpdating(false)
                });
        } else {
            console.error("No word selected");
        }
    }

    useEffect(() => {
        reload();
        // myFetch("http://localhost:8080/translate", "POST", { text: "hello", from: "en", to: "uk" })
        //     .then(res => console.log(res))
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
                    inputProps={{
                        autocomplete: 'new-password',
                        form: {
                          autocomplete: 'off',
                        },
                      }
                    }
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
            <TableContent
                words={filteredWords}
                selected={selected}
                setSelected={setSelected}
                handleClickListItem={handleClickListItem}
            />
            { search && filteredWords.length === 0 && (
                <Definitions word={search} />
            )}
            <AddWordsDialog open={isWordDialogOpen} handleClose={handleAddWordClose} search={search} />
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
        </Stack>
    );
}

export default BasicTable;