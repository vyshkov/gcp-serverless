import React from 'react';

import {
    AppBar,
    Avatar,
    Box,
    Stack,
    IconButton,
    Toolbar,
    Typography,
    Menu,
    MenuItem
} from '@mui/material';

import { useAuth } from '../auth/useLogin';

function Topbar() {
    const { signOut, userData, token } = useAuth();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position='static' sx={{ background: "rgba(0,0,0,0.2)" }}>
            <Toolbar>
                <Box
                    component="img"
                    alt="The house from the offer."
                    src="/logo.png"
                    sx={{ maxHeight: 55, opacity: 0.8 }}
                />
                <Box sx={{ flexGrow: 1 }} />
                {token && (
                    <Box>
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ p: 0 }}
                        >
                            <Avatar alt={userData?.given_name} src={userData?.picture} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleCloseUserMenu();
                                signOut();
                            }}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Topbar;
