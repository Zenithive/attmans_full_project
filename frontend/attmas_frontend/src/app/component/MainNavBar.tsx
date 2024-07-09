"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { Divider, MenuItem } from '@mui/material';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { Avatar } from '@mui/material';
import axios from 'axios';
import { APIS, SERVER_URL } from '../constants/api.constant';
import { removeUser } from '../reducers/userReducer';

function clearCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

export default function MainNavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);
  const [notificationCount, setNotificationCount] = React.useState<number>(0);

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${APIS.FORM1}?username=${userDetails.username}`, {
          headers: { username: userDetails.username },
        });
        setProfilePhoto(response.data.profilePhoto);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (userDetails.username) {
      fetchUserProfile();
    }
  }, [userDetails.username]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${APIS.NOTIFICATIONS}?username=${userDetails.username}`);
        setNotificationCount(response.data.notificationCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (userDetails.username) {
      fetchNotifications();
    }
  }, [userDetails.username]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post(APIS.LOGOUT);
      localStorage.clear();
      clearCookies();
      setProfilePhoto(null);
      dispatch(removeUser());
      router.push('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileRedirect = () => {
    handleMenuClose();
    router.push('/editprofile');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        Signed in as <br />
        {userDetails.username}
      </MenuItem>
      <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const notificationMenuId = 'primary-notification-menu';
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={notificationMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
    >
      <MenuItem onClick={handleNotificationMenuClose}>Notification 1</MenuItem>
      <Divider />
      <MenuItem onClick={handleNotificationMenuClose}>Notification 2</MenuItem>
      <Divider />
      <MenuItem onClick={handleNotificationMenuClose}>Notification 3</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationMenuOpen}>
        <IconButton
          size="large"
          aria-label={`show ${notificationCount} new notifications`}
          color="inherit"
        >
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {profilePhoto ? (
            <Avatar src={`${SERVER_URL}/${profilePhoto}`} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          right: 0,
          left: 'auto',
          width: 'calc(100% - 240px)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label={`show ${notificationCount} new notifications`}
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {profilePhoto ? (
                <Avatar src={`${SERVER_URL}/${profilePhoto}`} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationMenu}
    </Box>
  );
}
