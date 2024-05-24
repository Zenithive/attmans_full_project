"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { useRouter } from 'next/navigation';


const drawerWidth = 240;

export default function MainSideBar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'rgb(31,64,175)', // Set the background color to blue
            color: 'white', // Set the text color to white for better contrast
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{background:''}}>
          {/* <img src="https://zenithive.com/wp-content/uploads/2023/11/Zenithithive-Logo-Black-PNG-.png" alt="Logo" style={{ height: 40, margin: '0 auto' }} /> */}
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding onClick={() => handleNavigation('/dashboard')}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <DashboardCustomizeIcon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '1.15rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => handleNavigation('/innovators')}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <GroupIcon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Innovators" primaryTypographyProps={{ fontSize: '1.15rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => handleNavigation('/freelancers')}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <WorkIcon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Freelancers" primaryTypographyProps={{ fontSize: '1.15rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => handleNavigation('/industries')}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <BusinessIcon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Industries" primaryTypographyProps={{ fontSize: '1.15rem' }} />
            </ListItemButton>
          </ListItem>
        </List>
        {/* <Divider /> */}
      </Drawer>
    </Box>
  );
}