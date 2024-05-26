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
import { usePathname, useRouter } from 'next/navigation';


export const drawerWidth = 240;

export default function MainSideBar() {
  const router = useRouter();
  const pathName = usePathname();
  console.log("pathName", pathName)
  const handleNavigation = (path: string) => {
    router.push(path);
  }

  const SIDEBAR_LIST_NAVS = [
    {
      path: '/dashboard',
      icon: () => (
        <DashboardCustomizeIcon sx={{ fontSize: 22 }} />
      ),
      Name: "Dashboard"
    },
    {
      path: '/innovators',
      icon: () => (
        <GroupIcon sx={{ fontSize: 22 }} />
      ),
      Name: "Innovators"
    },
    {
      path: '/freelancers',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: "Freelancers"
    },
    {
      path: '/industries',
      icon: () => (
        <BusinessIcon sx={{ fontSize: 22 }} />
      ),
      Name: "Industries"
    }
  ];


  return (
    <Box  component="nav"
    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    aria-label="mailbox folders">
      <Drawer
        sx={{
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
        </Toolbar>
        <Divider />
        <List>
          {SIDEBAR_LIST_NAVS.map((navItem, index)=>(
            <ListItem key={index} disablePadding onClick={() => handleNavigation(navItem.path)}>
              <ListItemButton selected={pathName === navItem.path }>
                <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                  {navItem.icon()}
                </ListItemIcon>
                <ListItemText primary={navItem.Name} primaryTypographyProps={{ fontSize: '1.15rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
          {/* <ListItem disablePadding onClick={() => handleNavigation('/dashboard')}>
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
          </ListItem> */}
        </List>
        {/* <Divider /> */}
      </Drawer>
    </Box>
  );
}