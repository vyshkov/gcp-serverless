import { useEffect, useState } from "react";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { Word } from "../../types";
import { getRandomElements, shuffle } from "../../utils/arrays";

import useClient from "../../hooks/useClient";

const renderStars = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    const stars = Math.floor((correct / total) * 5);
    return (
        <Box sx={{ display: "flex" }}>{
            Array.from({ length: stars }, (_, i) => (
                <Typography key={i} variant="h4" sx={{ color: "success.main" }}>
                    ⭐
                </Typography>
            ))
        }
        </Box>
    );
};

interface GameProps {
    mode: "en" | "ua"
}

const Game = ({ mode }: GameProps) => {
    const theme = useTheme();
    const client = useClient();;
    const [allWords, setAllWords] = useState<Word[]>([]);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [variants, setVariants] = useState<string[]>([]);
    const [guessed, setGuessed] = useState(false);

    const [round, setRound] = useState(0);

    useEffect(() => {
        setRound(0);
        setCorrect(0);
        setIncorrect(0);
        setGuessed(false);

        client.getAllWords()
            .then(words => setAllWords(words.sort(() => Math.random() - 0.5).slice(0, 5)));

    }, [mode]);

    useEffect(() => {
        if (allWords.length && round < allWords.length) {
            setVariants(shuffle(mode === "en" ? [
                allWords[round].translation,
                ...getRandomElements(allWords, round, 2).map(w => w.translation),
            ] : [
                allWords[round].word,
                ...getRandomElements(allWords, round, 2).map(w => w.word),
            ]));
        }
    }, [round, allWords]);

    if (allWords.length === 0) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    if (round >= allWords.length) {
        return (
            <Box sx={{ height: 1, width: 1, display: "flex", position: "relative", flexDirection: "column" }}>
                <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <Typography variant="h4">Game over!</Typography>
                    <Typography>Correct: {correct}</Typography>
                    <Typography>Incorrect: {incorrect}</Typography>
                    {renderStars(correct, incorrect)}
                </Box>
                <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mx: 1, p: 2 }}
                        onClick={() => {
                            setRound(0);
                            setCorrect(0);
                            setIncorrect(0);
                            setGuessed(false);
                        }}
                    >
                        Play again
                    </Button>
                </Box>
            </Box>
        );
    }

    const mainWord = mode === "en" ? allWords[round].word : allWords[round].translation;
    const mainTranslation = mode === "en" ? allWords[round].translation : allWords[round].word;

    return (
        <Box sx={{ height: 1, width: 1, display: "flex", position: "relative", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h4">{mainWord}</Typography>
            </Box>
            <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <Box sx={{ textAlign: "center" }}>
                    {variants.map((variant) => (
                        <Button
                            key={variant}
                            variant={
                                guessed ? "contained" : "outlined"
                            }
                            color={guessed && (variant === mainTranslation ? "success" : "error") || "primary"}
                            sx={{ m: 1, p: 2, pointerEvents: guessed ? "none" : "auto" }}
                            onClick={() => {
                                setGuessed(true);
                                if (variant === mainTranslation) {
                                    setCorrect(correct + 1);
                                } else {
                                    setIncorrect(incorrect + 1);
                                }
                            }}
                        >
                            {variant}
                        </Button>
                    ))}
                </Box>
            </Box>
            <Box>
                <Typography>Correct: {correct}, Incorrect: {incorrect}, Round: {round}</Typography>
            </Box>
            {
                guessed && (
                    <Box
                        sx={{
                            position: "absolute",
                            display: "flex",
                            bottom: 0,
                            width: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.custom?.transparentLight,
                            backdropFilter: "blur(10px)",
                            p: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setRound(round + 1);
                                setGuessed(false);
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                )
            }

        </Box>
    );
}

export default Game;