import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AddIcon from '@mui/icons-material/Add'

import { Box, CircularProgress, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useLogin';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

import API_PATH from '../api';

interface Word {
    word: string;
    translation: string;
}

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export default function BasicTable() {
    const { token } = useAuth();
    const [search, setSearch] = useState("");
    const [words, setWords] = useState<Word[]>([]);
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        setInProgress(true);
        fetch(`${API_PATH}/service-dictionary`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(res => res.json())
        .then(words => {
            console.log(words);
            setWords(words);
        })
        .catch(err => console.log(err))
        .finally(() => setInProgress(false));

    }, []);

    return (
        <Stack sx={{ flex: 1, display: "flex", justifyContent: "flex-start", width: 1, padding: 0 }}>
            <Box sx={{ width: 1, px: 2, pt: 3 }}>
                <OutlinedInput
                    placeholder='Search...'
                    sx={{ width: 1 }}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={inProgress}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => { }}
                                edge="end"
                            >
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>

            {inProgress ? (
                <CircularProgress />
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
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
        </Stack>
    );
}