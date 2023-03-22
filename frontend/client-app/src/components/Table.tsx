import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AddIcon from '@mui/icons-material/Add'

import { Box, CircularProgress, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useLogin';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

import API_PATH from '../api';
import AddWordsDialog from './AddWordDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Word {
    word: string;
    translation: string;
}

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export default function BasicTable() {
    const { token, setIsUserAllowed } = useAuth();
    const [search, setSearch] = useState("");
    const [words, setWords] = useState<Word[]>([]);
    const [inProgress, setInProgress] = useState(false);
    const [isWordDialogOpen, setIsDialogOpen] = useState(false);

    const [selected, setSelected] = useState<string | null>(null);
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
        if (token) {
            reload(token, setIsUserAllowed);
        }
        setIsDialogOpen(false);
    };

    const reload = (token: string, setIsUserAllowed: (allowed: boolean) => void) => {
        setInProgress(true);
        return fetch(`${API_PATH}/service-dictionary`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                if (res.status === 403) {
                    setIsUserAllowed(false);
                    throw new Error("You are not authorized to access this resource");
                }
                return res;
            })
            .then(res => res.json())
            .then(words => {
                console.log(words);
                setWords(words.reverse());
            })
            .catch(err => console.log(err))
            .finally(() => setInProgress(false));
    }

    useEffect(() => {
        if (token) {
            reload(token, setIsUserAllowed);
        }
    }, [token, setIsUserAllowed]);

    return (
        <Stack sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", width: 1, padding: 0 }}>
            <Box sx={{ width: 1, px: 2, pt: 3 }}>
                <OutlinedInput
                    placeholder='Search...'
                    sx={{ width: 1 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={inProgress}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleAddWordOpen}
                                edge="end"
                            >
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>

            {inProgress ? (
                <CircularProgress sx={{ p: 2 }} size={80} />
            ) : (
                words?.length === 0 ? (
                    <Typography sx={{ textAlign: "center", pt: 2 }}>
                        No words found
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ px: 1, pt: 2, flex: 1, background: "transparent", boxShadow: "none" }}>
                        <Table aria-label="simple table">
                            <TableBody>
                                {words.filter(el => wordMatchesSearch(el, search)).map((row) => (
                                    <TableRow
                                        key={row.word}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: selected === row.word ? "rgba(0,0,0,0.5)" : "transparent" }}
                                        onClick={(evt: React.MouseEvent<HTMLElement>) => {
                                            handleClickListItem(evt);
                                            setSelected(row.word);
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.word}
                                        </TableCell>
                                        <TableCell align="right">{row.translation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
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
                    onClick={() => alert(selected)}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => alert(selected)}
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