import { Stack } from '@mui/system';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react';

import { enqueueSnackbar } from 'notistack';

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
import useTheme from '@mui/material/styles/useTheme';

import useClient from '../../hooks/useClient';

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
    autoTranslation?: string;
}
  
export const AddWordsDialog = ({ open, handleClose, search, autoTranslation }: AddWordsDialogProps) => {
    const client = useClient();
    const theme = useTheme();

    const isEnglish = /^[a-zA-Z\s-]+$/.test(search);
 
    const [word, setWord] = useState<string>(isEnglish ? search : autoTranslation || "");
    const [translation, setTranslation] = useState<string>(isEnglish ? autoTranslation || "" : search);
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        setWord(search);
        setTranslation(autoTranslation || "");
    }, [search, autoTranslation]);

    const handleAddWord = () => {
        setInProgress(true);
        client.addWord(word, translation)
            .catch(() => enqueueSnackbar("Failed to create word", { variant: "error" }))
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
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Add word
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleAddWord} disabled={inProgress}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <Stack sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", width: 1, padding: 0, minHeight: 0 }}>
                <Box sx={{ p: 3, width: 1 }}>
                    <TextField
                        disabled={inProgress}
                        sx={{ width: 1 }}
                        required
                        label="Word"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                    />
                </Box>
                <Box sx={{ p: 3, width: 1 }}>
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