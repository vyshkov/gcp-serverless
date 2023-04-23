import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";

import { Word } from "../../types";

interface TableContentProps {
    words: Word[];
    selected: Word | null;
    setSelected: (w: Word | null) => void;
}

export const TableContent = ({
    words,
    selected,
    setSelected,
}: TableContentProps) => {

    const theme = useTheme();

    return (
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
                                onClick={() => {
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
    );
}