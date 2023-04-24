import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    useTheme,
} from '@mui/material';

import { Word } from '../../types';
import Suggestions from './Suggestions';

import { DictionaryEntry } from '../../utils/freeDictionary';
import { UrbanDictionaryEntry } from '../../utils/urbanDictionary';

const Transition = forwardRef((
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface AddWordsDialogProps {
    word?: Word | null;
    handleClose: () => void;
    deleteWord: () => void;
    onUrbanDictionaryWordClick: (definitions: UrbanDictionaryEntry[]) => void;
    onFreeDictionaryWordClick: (definitions: DictionaryEntry[]) => void;
}

export const WordDetailsDialog = ({ 
    deleteWord, 
    word, 
    handleClose,
    onUrbanDictionaryWordClick,
    onFreeDictionaryWordClick,
}: AddWordsDialogProps) => {
    const theme = useTheme();

    return (
        <Dialog
            open={Boolean(word)}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    backgroundColor: theme.custom?.transparentMedium,
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {word?.word} - {word?.translation}
            </DialogTitle>
            <DialogContent>
                <Suggestions 
                    onFreeDictionaryWordClick={onFreeDictionaryWordClick}
                    onUrbanDictionaryWordClick={onUrbanDictionaryWordClick}
                    onTranslationPressed={() => {}}
                    word={word?.word || ""} 
                    translate={false}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<VoiceChatIcon />}
                    onClick={() => {
                        // use SpeechSynthesisUtterance

                        const msg = new SpeechSynthesisUtterance(word?.word || "");
                        // eslint-disable-next-line prefer-destructuring
                        msg.voice = speechSynthesis.getVoices()[1];
                        msg.lang = "en-US";

                        window.speechSynthesis.speak(msg);
                    }}
                    variant="outlined"
                >
                    Pronaunce
                </Button>
                <Button 
                    onClick={() => {
                        deleteWord();
                        handleClose();
                    }} 
                    variant="outlined" 
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}