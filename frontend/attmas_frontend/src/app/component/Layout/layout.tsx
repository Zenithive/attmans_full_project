'use client';
import React from 'react';
import MainSideBar, { drawerWidth } from '../MainSideBar';
import MainNavBar from '../MainNavBar';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  displayMainSideBar: boolean; // Prop to indicate whether MainSideBar should be displayed
}

const Layout: React.FC<LayoutProps> = ({ children, displayMainSideBar }) => {
  const pathname = usePathname();

  // Check if the current route is '/' or '/signup'
  const isHomeOrSignup = pathname === '/' || pathname === '/signup';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Conditionally render MainNavBar and MainSideBar based on the current route */}
      {!isHomeOrSignup && <MainNavBar />}
      {!isHomeOrSignup && displayMainSideBar && <MainSideBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: !isHomeOrSignup && displayMainSideBar
              ? `calc(100% - ${drawerWidth}px)`
              : '100%',
          }, // Adjust width when sidebar is hidden
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
