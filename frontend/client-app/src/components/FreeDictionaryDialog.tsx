/* eslint-disable react/no-array-index-key */
import { Stack } from '@mui/system';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';

import { DictionaryEntry } from '../utils/freeDictionary';

const Transition = forwardRef((
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface FreeDictionaryDialogProps {
    handleClose: () => void;
    definitions: DictionaryEntry[];
}
  
export const FreeDictionaryDialog = ({ definitions, handleClose }: FreeDictionaryDialogProps) => {
    const theme = useTheme();
 
    const [wordDefinitions, setWordDefinitions] = useState<DictionaryEntry[]>([]);
    
    useEffect(() => {
        setWordDefinitions(definitions);
    }, [definitions]);

    return (
        <Dialog
            fullScreen
            open={!!wordDefinitions.length}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    backgroundColor: theme.custom?.transparentMedium,
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <AppBar sx={{ position: 'static', background: theme.custom?.transparentLight }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Stack 
                sx={{ 
                        flex: 1, 
                        display: "flex", 
                        justifyContent: "flex-start",
                        alignItems: "center", 
                        width: 1, 
                        padding: 1, 
                        minHeight: 0, 
                        overflow: "auto" 
                    }}
            >
                {
                    wordDefinitions.map((definition, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                width: 1,
                                padding: 1,
                                backgroundColor: theme.custom?.transparentLight,
                                borderRadius: 1,
                                marginBottom: 1,
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {definition.word}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                {definition.phonetic}
                            </Typography>
                            {
                                definition.meanings.map((meaning, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                            width: 1,
                                            padding: 1,
                                            backgroundColor: theme.custom?.transparentLight,
                                            borderRadius: 1,
                                            marginBottom: 1,
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                            {meaning.partOfSpeech}
                                        </Typography>
                                        {
                                            meaning.definitions.map((definition, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "flex-start",
                                                        alignItems: "flex-start",
                                                        width: 1,
                                                        padding: 1,
                                                        backgroundColor: theme.custom?.transparentLight,
                                                        borderRadius: 1,
                                                        marginBottom: 1,
                                                    }}
                                                >
                                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                        {definition.definition}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                        {definition.example}
                                                    </Typography>
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                ))
                                                
                            }
                        </Box>
                    ))
                }
            </Stack>
        </Dialog>
    );
}