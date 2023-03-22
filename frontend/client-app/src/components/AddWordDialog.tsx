import {useEffect, forwardRef, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/system';
import { useAuth } from '../auth/useLogin';
import API_PATH from '../api';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface AddWordsDialogProps {
    open: boolean;
    handleClose: () => void;
    search: string;
}

export default function AddWordsDialog({ open, handleClose, search }: AddWordsDialogProps) {
    
    const { token, setIsUserAllowed } = useAuth();
    const [word, setWord] = useState<string>(search);
    const [translation, setTranslation] = useState<string>("");
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        setWord(search);
    }, [search]);

    const handleAddWord = () => {
        setInProgress(true);
        fetch(`${API_PATH}/service-dictionary`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word,
                translation,
            })
        })
        .then(res => {
            if (res.status === 403) {
                setIsUserAllowed(false);
                throw new Error("You are not authorized to access this resource");
            }
            return res;
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