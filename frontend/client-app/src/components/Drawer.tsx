import { Link } from "react-router-dom";

import {
    Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from "@mui/material";

import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

interface AppDrawerProps {
    open: boolean;
    onCloseMenu: () => void;
}

const AppDrawer = ({ open, onCloseMenu }: AppDrawerProps) => (
    <Drawer
        anchor="left"
        open={open}
        onClose={onCloseMenu}
    >
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/game" onClick={onCloseMenu}>
                        <ListItemIcon>
                            <VideogameAssetIcon />
                        </ListItemIcon>
                        <ListItemText primary="Guess words" />
                    </ListItemButton>
                </ListItem>

            </List>
            <Divider />
        </Box>
    </Drawer>
)


export default AppDrawer;