import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import {
    AppBar,
    Avatar,
    Box,
    Divider,
    FormControlLabel,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Switch,
    Toolbar,
    Tooltip,
    useTheme,
} from '@mui/material';

import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '../auth/useLogin';
import { useCustomTheme } from '../themes/CustomThemeProvider';
import AppDrawer from './Drawer';

const Topbar = () => {
    const { signOut, userData, token } = useAuth();
    const { setTheme, currentTheme } = useCustomTheme();
    const theme = useTheme();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position='static' sx={{ background: theme.custom?.transparentLight }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                    <Box
                        component="img"
                        alt="The house from the offer."
                        src="/logo.png"
                        sx={{ maxHeight: 55, opacity: 0.8 }}
                    />
                </Link>
                
                <Box sx={{ flexGrow: 1 }} />
                {token && (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32 }} src={userData?.picture} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem disabled onClick={handleClose}>
                                <Avatar /> {userData?.name}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => {
                                if (currentTheme === 'normal') {
                                    setTheme('dark');
                                } else {
                                    setTheme('normal');
                                }
                                handleClose();
                            }}>
                                <FormControlLabel control={<Switch checked={currentTheme === 'dark'} />} label="Dark skin" />
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                signOut();
                            }}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>

                    </>
                )}
            </Toolbar>
            <AppDrawer open={isDrawerOpen} onCloseMenu={() => setIsDrawerOpen(false)} />
        </AppBar >
    );
}

export default Topbar;
