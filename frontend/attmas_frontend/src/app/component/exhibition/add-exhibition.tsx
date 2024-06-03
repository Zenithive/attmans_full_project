"use client"

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useContext } from 'react';
import { Button, Divider, Drawer } from '@mui/material';


export const AddExhibition = () => {
    const [open, toggleDrawer] = React.useState(false);

    const closeHandler = () => {
        toggleDrawer(false);
    }
    return (
        <>
            <Button onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained' sx={{ borderRadius: 3 }}>Create Exhibition</Button>
            <Drawer sx={{'& .MuiDrawer-paper': {width: "50%", borderRadius: 3, pr: 10, mr: -8}}} anchor="right" open={open} onClose={closeHandler}>
                <Box component="div" sx={{display:"flex", justifyContent: "space-between", pl: 4}}>
                    <h2>Create Exhibition</h2>
                    <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                
            </Drawer>
        </>
    );
}
