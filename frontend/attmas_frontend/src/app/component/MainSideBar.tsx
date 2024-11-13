"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
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
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useMediaQuery, Theme } from '@mui/material';
import { getRoleBasedAccess } from '../services/user.access.service';
import { translationsforSidebar } from '../../../public/trancation';

export const drawerWidth = 240;

export default function MainSideBar() {
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const language = userDetails.language || 'english';
  const t = translationsforSidebar[language as keyof typeof translationsforSidebar] || translationsforSidebar.english;



  const [isClient, setIsClient] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();
  const pathName = usePathname();
  const handleNavigation = (path: string) => {
    router.push(path);
  }

  const {
    isAdmin,
    isFreelancer,
    isInnovator,
    isProjectOwner,
    isVisitor
  } = getRoleBasedAccess(userDetails.userType);

  const SIDEBAR_LIST_NAVS = [
    {
      path: '/dashboard',
      icon: () => (
        <DashboardCustomizeIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.dashboard,
      isVisible: (isAdmin || isFreelancer || isProjectOwner || isInnovator)
    },
    {
      path: '/innovators',
      icon: () => (
        <GroupIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.innovators,
      isVisible: (isAdmin)
    },
    {
      path: '/freelancers',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.freelancers,
      isVisible: (isAdmin)
    },
    {
      path: '/projectowner',
      icon: () => (
        <BusinessIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.projectOwner,
      isVisible: isAdmin
    },
    {
      path: '/projects',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.projects,
      isVisible: (isAdmin || isFreelancer || isProjectOwner || isInnovator)
    },

    {
      path: '/myproject',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.myProjects,
      isVisible: (isAdmin || isFreelancer || isProjectOwner || isInnovator)
    },
    {
      path: '/proposal',
      icon: () => (
        <WorkIcon sx={{ fontSize: 22 }} />
      ),
      Name: t.proposal,
      isVisible: (isFreelancer || isAdmin || isProjectOwner)
    },
    {
      path: '/exhibition',
      icon: () => (
        <Diversity1Icon sx={{ fontSize: 22 }} />
      ),
      Name: t.exhibition,
      isVisible: (isAdmin || isProjectOwner || isInnovator || isVisitor)
    },
  ];

  // const filteredNavs = userDetails.userType === 'Freelancer'
  //   ? SIDEBAR_LIST_NAVS.filter(nav => nav.Name !== "Freelancers" && nav.Name !== "Project Owner")
  //   : SIDEBAR_LIST_NAVS;

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (!isClient) {
    return null;
  }

  return (
    <Box component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile && !isHovered ? 60 : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "primary.main",
            color: 'white',
            transition: 'width 0.3s',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Image src="/attmans (png)-01.png" alt="attmans logo" width={100} height={70} />
          </Box>
        </Toolbar>
        {pathName !== '/profile' && (
          <List>
            {SIDEBAR_LIST_NAVS.map((navItem, index) => (
              <>
                {navItem.isVisible ? <ListItem key={index} disablePadding onClick={() => handleNavigation(navItem.path)}>
                  <ListItemButton selected={pathName === navItem.path} sx={{ borderRadius: 3 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {navItem.icon()}
                    </ListItemIcon>
                    {(!isMobile || isHovered) && (
                      <ListItemText primary={navItem.Name} primaryTypographyProps={{ fontSize: '1.15rem' }} />
                    )}
                  </ListItemButton>
                </ListItem> : ""}
              </>
            ))}
          </List>
        )}
      </Drawer>
    </Box>
  );
}
