"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { Divider, MenuItem, Typography } from '@mui/material';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { Avatar } from '@mui/material';
import axios from 'axios';
import { APIS, SERVER_URL } from '../constants/api.constant';
import { removeUser } from '../reducers/userReducer';
import DOMPurify from 'dompurify';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import Jobs from '../projects/page';

interface Email {
  _id: string;
  to: string;
  subject: string;
  exhibitionId: string;
  projectId: string;
  read: boolean;
  boothUsername?: string;
  title: string;
  sentAt: Date;
  status?: string;
  status2?: string;
  jobId?: StaticRange;
  exhibitionUserFirstName?: string;
  exhibitionUserLastName?: string;
  adminFirstName?: string;
  adminLastName?: string;

}

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
  const [notifications, setNotifications] = React.useState<Email[]>([]);

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
        const notificationsWithTimestamp = response.data.map((notification: Email) => ({
          ...notification,
          sentAt: new Date(notification.sentAt),
        })).sort((a: { sentAt: { getTime: () => number; }; }, b: { sentAt: { getTime: () => number; }; }) => b.sentAt.getTime() - a.sentAt.getTime());
        setNotifications(notificationsWithTimestamp);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
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

  const handleNotificationClick = async (notificationId: string, exhibitionId: string) => {
    try {
      await axios.post(`${APIS.MARK_AS_READ}`, { id: notificationId });
      setNotifications(prevNotifications => {
        return prevNotifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        ).sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
      });
      window.open(`/view-exhibition?exhibitionId=${exhibitionId}`, '_blank');
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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

  const generateNotificationHtml = (notification: Email) => {
    const baseUrl = 'http://localhost:4200/projects';
    const userName = `${userDetails.firstName} ${userDetails.lastName}`;
    const viewExhibitionUrl = `/view-exhibition?exhibitionId=${notification.exhibitionId}`;

    if (notification.subject === 'New Project Created') {
      return `
            Dear ${userName},<br>
            You have been notified that ${notification.adminFirstName} ${notification.adminLastName} has created a project. 
            <a href="${baseUrl}" style="color:blue; cursor:pointer;">Click here</a> to view projects "${notification.title}".
        `;
    }

    else if (notification.status) {
      return `
            Dear ${userName},<br>
            Your booth "${notification.title}" request for exhibition is ${notification.status} by "${notification.exhibitionUserFirstName} ${notification.exhibitionUserLastName}". Click <a href="https://attmans.netlify.app${viewExhibitionUrl}" target="_blank">here</a> for more details.
        `;
    }

    else if (notification.boothUsername) {
      return `
            Dear ${userName},<br>
            You have been notified that ${notification.boothUsername} has requested to participate in the Exhibition "${notification.title}". Click <a href="${viewExhibitionUrl}" target="_blank">here</a> to approve/reject.
        `;
    }

    else if(notification.status2){
      console.log('job',notification.status2)
      return `
       Dear ${userName},<br>
        Your project "${notification.title}" has been ${notification.status2} by ${notification.adminFirstName} ${notification.adminLastName}. 
        <a href="${baseUrl}" style="color:blue; cursor:pointer;">Click here</a> to view projects.
      `;
    }

    return `
        Dear ${userName},<br>
        You have been invited to participate in the exhibition "${notification.title}". Click <a href="${viewExhibitionUrl}" target="_blank">here</a> to participate.
    `;
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
      sx={{width:'14%'}}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        Signed in as <br />
        {userDetails.firstName} {userDetails.lastName}<br/>
        ({userDetails.userType})
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
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationMenuClose}
    >
      <Box sx={{ width: 400 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', px: 2, py: 1 }}>
          Notifications
        </Typography>

        {notifications.filter(notification => !notification.read).length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
            {notifications.filter(notification => !notification.read).map((notification, index) => (
              <React.Fragment key={notification._id}>
                <MenuItem
                  onClick={() => handleNotificationClick(notification._id, notification.exhibitionId)}
                  sx={{
                    whiteSpace: 'normal',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    backgroundColor: 'grey.200',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateNotificationHtml(notification)) }} />
                  <IconButton size="small" color="inherit">
                    <CircleIcon fontSize="inherit" sx={{ fontSize: '0.6rem' }} />
                  </IconButton>
                </MenuItem>
                {index < notifications.filter(notification => !notification.read).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}

        {notifications.filter(notification => notification.read).length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
            {notifications.filter(notification => notification.read).map((notification, index) => (
              <React.Fragment key={notification._id}>
                <MenuItem
                  onClick={() => handleNotificationClick(notification._id, notification.exhibitionId)}
                  sx={{
                    whiteSpace: 'normal',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateNotificationHtml(notification)) }} />
                  <IconButton size="small" color="inherit">
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
                {index < notifications.filter(notification => notification.read).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}

        {notifications.length === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', py: 1 }}>
              No new notifications.
            </Typography>
          </Box>
        )}
      </Box>
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
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationMenuOpen}>
        <IconButton size="large" aria-label="show notifications" color="inherit">
          <Badge badgeContent={notifications.filter(notification => !notification.read).length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          {profilePhoto ? <Avatar src={`${SERVER_URL}${profilePhoto}`} /> : <AccountCircle />}
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
          '@media (max-width: 767px)':{
            width: '100%',
          }
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={notifications.filter(notification => !notification.read).length} color="error">
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
