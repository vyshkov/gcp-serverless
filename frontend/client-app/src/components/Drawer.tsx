import { Link } from "react-router-dom";

import {
    Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from "@mui/material";

import GitHubIcon from '@mui/icons-material/GitHub';
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
                    <ListItemButton component={Link} to="/gameen" onClick={onCloseMenu}>
                        <ListItemIcon>
                            <VideogameAssetIcon />
                        </ListItemIcon>
                        <ListItemText primary="Guess words [EN]" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/gameua" onClick={onCloseMenu}>
                        <ListItemIcon>
                            <VideogameAssetIcon />
                        </ListItemIcon>
                        <ListItemText primary="Guess words [UA]" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="https://github.com/vyshkov/gcp-serverless" onClick={onCloseMenu}>
                        <ListItemIcon>
                            <GitHubIcon />
                        </ListItemIcon>
                        <ListItemText primary="Github" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="https://github.com/vyshkov/gcp-serverless/actions/workflows/publish-surge.yaml" onClick={onCloseMenu}>
                        <img 
                            src="https://github.com/vyshkov/gcp-serverless/actions/workflows/publish-surge.yaml/badge.svg" 
                            alt="Publish to surge"
                        />
                    </ListItemButton>
                </ListItem>
            </List>
            

        </Box>
    </Drawer>
)


export default AppDrawer;