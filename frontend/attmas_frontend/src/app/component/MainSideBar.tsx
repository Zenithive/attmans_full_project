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
import Diversity1Icon from '@mui/icons-material/Diversity1';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export const drawerWidth = 240;

export default function MainSideBar() {
  const router = useRouter();
  const pathName = usePathname();
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
    },
    {
      path: '/exhibition',
      icon: () => (
        <Diversity1Icon sx={{ fontSize: 22 }} />
      ),
      Name: "Exhibition"
    },
    {
      path: '/jobs',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: "Jobs"
    }

  ];

  return (
    <Box component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders">
      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "primary.main",
            color: 'white', // Set the text color to white for better contrast
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          {/* <Image src="/attmans (png)-01.png" alt="attmans logo" width={100} height={70} /> */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Image src="/attmans (png)-01.png" alt="attmans logo" width={100} height={70} />
          </Box>
        </Toolbar>
        {/* <Divider /> */}
        {pathName !== '/profile' && (
          <List>
            {SIDEBAR_LIST_NAVS.map((navItem, index) => (
              <ListItem key={index} disablePadding onClick={() => handleNavigation(navItem.path)}>
                <ListItemButton selected={pathName === navItem.path} sx={{ borderRadius: 3 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {navItem.icon()}
                  </ListItemIcon>
                  <ListItemText primary={navItem.Name} primaryTypographyProps={{ fontSize: '1.15rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </Box>
  );
}
