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

import { UrbanDictionaryEntry } from '../../utils/urbanDictionary';

const Transition = forwardRef((
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface UrbanDictionaryDialogProps {
    handleClose: () => void;
    definitions: UrbanDictionaryEntry[];
}
  
export const UrbanDictionaryDialog = ({ definitions, handleClose }: UrbanDictionaryDialogProps) => {
    const theme = useTheme();
 
    const [wordDefinitions, setWordDefinitions] = useState<UrbanDictionaryEntry[]>([]);
    
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
                {wordDefinitions.map((definition, index) => (
                    <Box 
                        key={definition.defid} 
                        sx={{ 
                            display: "flex",
                            flexDirection: "column",
                            width: 1, 
                            m: 1, p: 1, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 1 
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: "bold", 
                                color: theme.palette.primary.main, 
                                marginBottom: 1 
                            }}
                        >
                            [{index}] {definition.word}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>{definition.definition}</Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>{definition.example}</Typography>
                        <Typography variant="caption" sx={{ marginBottom: 1 }}>{definition.author}</Typography>
                        {definition.thumbs_up && (
                            <Typography variant="caption" sx={{ marginBottom: 1, textAlign: "right" }}>
                                👍 {definition.thumbs_up}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Stack>
        </Dialog>
    );
}