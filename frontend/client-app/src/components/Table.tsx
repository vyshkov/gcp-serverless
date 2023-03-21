import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';


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

export default function BasicTable() {
  return (
    
    <TableContainer component={Paper} sx={{ px: 1, pt: 4, flex: 1, background: "transparent", boxShadow: "none" }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Word</TableCell>
            <TableCell align="right">Translation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
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

  );
}