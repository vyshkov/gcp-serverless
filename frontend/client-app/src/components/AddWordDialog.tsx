import { Stack } from '@mui/system';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import useFetch from '../hooks/useFetch';

const Transition = forwardRef((
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface AddWordsDialogProps {
    open: boolean;
    handleClose: () => void;
    search: string;
}

export const AddWordsDialog = ({ open, handleClose, search }: AddWordsDialogProps) => {
    const myFetch = useFetch();
    const [word, setWord] = useState<string>(search);
    const [translation, setTranslation] = useState<string>("");
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        setWord(search);
    }, [search]);

    const handleAddWord = () => {
        setInProgress(true);
        myFetch("/service-dictionary", "POST", {
            word,
            translation,
        })
        .finally(() => { 
            setInProgress(false);
            setWord("");
            setTranslation("");
            handleClose();           
        });
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <AppBar sx={{ position: 'static', background: "rgba(0,0,0,0.2)" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Add word
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleAddWord} disabled={inProgress}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack sx={{ display: "flex" }}>
                <Box sx={{ p: 3, flex: 1 }}>
                    <TextField
                        disabled={inProgress}
                        sx={{ width: 1 }}
                        required
                        label="Word"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                    />
                </Box>
                <Box sx={{ p: 3, flex: 1 }}>
                    <TextField
                        disabled={inProgress}
                        sx={{ width: 1 }}
                        required
                        label="Переклад"
                        value={translation}
                        onChange={(e) => setTranslation(e.target.value)}
                    />
                </Box>
            </Stack>
        </Dialog>
    );
}