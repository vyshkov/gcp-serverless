import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AddIcon from '@mui/icons-material/Add'

import { Box, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useState } from 'react';

const rows = [
    { word: 'Hello', translation: 'Привіт' },
    { word: 'Goodbye', translation: 'До побачення' },
    { word: 'Thank you', translation: 'Дякую' },
    { word: 'You are welcome', translation: 'Не за що' },
    { word: 'Yes', translation: 'Так' },
    { word: 'No', translation: 'Ні' },
    { word: 'Please', translation: 'Будь ласка' },
    { word: 'Excuse me', translation: 'Вибачте' },
    { word: 'I am sorry', translation: 'Вибачте' },
    { word: 'Good morning', translation: 'Доброго ранку' },
    { word: 'Good afternoon', translation: 'Доброго дня' },
    { word: 'Good evening', translation: 'Доброго вечора' },
    { word: 'Good night', translation: 'Доброї ночі' },
    { word: 'How are you?', translation: 'Як справи?' },
    { word: 'I am fine, thank you', translation: 'Добре, дякую' },
    { word: 'I am fine, and you?', translation: 'Добре, а ви?' },
];

function wordMatchesSearch(w: { word: string; translation: string; }, search: string) {
    return w.word.toLowerCase().includes(search.toLowerCase())
        || w.translation.toLowerCase().includes(search.toLowerCase());
}

export default function BasicTable() {
    const [search, setSearch] = useState("");

    return (
        <>
            <Box sx={{ width: 1, px: 2, pt: 3 }}>
                <OutlinedInput
                    placeholder='Search...'
                    sx={{ width: 1 }}
                    onChange={(e) => setSearch(e.target.value)}
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

            <TableContainer component={Paper} sx={{ px: 1, pt: 2, flex: 1, background: "transparent", boxShadow: "none" }}>
                <Table aria-label="simple table">
                    <TableBody>
                        {rows.filter(el => wordMatchesSearch(el, search)).map((row) => (
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
        </>
    );
}