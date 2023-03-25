import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import AddIcon from '@mui/icons-material/Add'

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
    OutlinedInput
} from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { AddWordsDialog } from './AddWordDialog';
import useFetch from '../hooks/useFetch';

interface Word {
    id: string;
    word: string;
    translation: string;
}

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

interface TableContentProps {
    words: Word[];
    search: string;
    selected: Word | null;
    setSelected: (w: Word | null) => void;
    handleClickListItem: (evt: React.MouseEvent<HTMLElement>) => void;
}

export const TableContent = ({ 
    words, 
    search, 
    selected, 
    setSelected, 
    handleClickListItem 
}: TableContentProps) => (
    words?.length === 0 ? (
        <Typography sx={{ textAlign: "center", pt: 2 }}>
            No words found
        </Typography>
    ) : (
        <TableContainer
            component={Paper}
            sx={{ px: 1, pt: 2, flex: 1, background: "transparent", boxShadow: "none", overflow: "auto" }}
        >
            <Table>
                <TableBody>
                    {words.filter(el => wordMatchesSearch(el, search)).map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: selected?.id === row.id ? "rgba(0,0,0,0.5)" : "transparent" }}
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
            .then(setWords)
            .catch(err => console.error(err))
            .finally(() => setIsUpdating(false));
    }

    const deleteWord = () => {
        if (selected) {
            setIsUpdating(true);
            myFetch(`service-dictionary/${selected.id}`, "DELETE")
                .then(handleClose)
                .then(reload)
                .catch(console.error)
                .finally(() => {
                    setIsUpdating(false)
                });
        } else {
            console.error("No word selected");
        }
    }

    useEffect(() => {
        reload();
    }, []);

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
                    placeholder='Search...'
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
                words={words}
                search={search}
                selected={selected}
                setSelected={setSelected}
                handleClickListItem={handleClickListItem}
            />
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