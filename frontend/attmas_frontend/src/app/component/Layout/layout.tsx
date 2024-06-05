"use client"
import React from 'react';
import MainSideBar, { drawerWidth } from '../MainSideBar';
import MainNavBar from '../MainNavBar';
import { Box, CssBaseline, Toolbar } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  displayMainSideBar: boolean; // Prop to indicate whether MainSideBar should be displayed
}

const Layout: React.FC<LayoutProps> = ({ children, displayMainSideBar }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MainNavBar />
      {displayMainSideBar && <MainSideBar />} {/* Conditionally render MainSideBar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ...(displayMainSideBar && { width: '100%' }), // Adjust width when sidebar is hidden
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;




