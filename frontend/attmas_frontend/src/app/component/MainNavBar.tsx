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
import { Divider, MenuItem, Tab, Typography } from '@mui/material';
import { UserSchema, selectUserSession, updateProfilePhoto } from '../reducers/userReducer';
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { Avatar } from '@mui/material';
import { APIS, SERVER_URL } from '../constants/api.constant';
import { removeUser } from '../reducers/userReducer';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import { CommonAvatar } from './common-ui/avatar.component';
import axiosInstance from '../services/axios.service';
import { TabContext, TabList, TabPanel } from '@mui/lab';

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
  status3?: string;
  jobId?: StaticRange;
  exhibitionUserFirstName?: string;
  exhibitionUserLastName?: string;
  applicationTitle?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminStatus?:string;
  applicationId?: string,
  first?: string,
  last?: string,
  notifType: string;
  userType: string;
  awardStatus: string;
  isShow?: boolean;
  boothTitle?:string;
  exhibitionName?: string;
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

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`${APIS.FORM1}?username=${userDetails.username}`, {
          headers: { username: userDetails.username },
        });
        setProfilePhoto(response.data.profilePhoto);
        dispatch(updateProfilePhoto(response.data.profilePhoto));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (userDetails.username) {
      fetchUserProfile();
    }
  }, [userDetails.username, profilePhoto]);

  const isNotificationValid = (singleNotification: Email) => {

    if (singleNotification.applicationId && singleNotification.status3) {
      return true;
    }


    if (singleNotification.subject.toLowerCase().includes('milestone')) {
      return true;
    }

    if (singleNotification.subject.toLowerCase().includes('proposal')) {
      return true;
    }


    if (singleNotification.subject.toLowerCase().includes('proposal') && singleNotification.userType == "Project Owner" ) {
      return true;
    }

    if (singleNotification.subject === 'New Project Created') {
      return true;
    }    

    if (singleNotification.status && singleNotification.to == userDetails.username) {
      return true;
    }

    if (singleNotification.boothUsername) {
      return true;
    }

    if (singleNotification.status2) {
      return true;
    }

    if (singleNotification.notifType === 'Apply Create' && (userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') && (singleNotification.adminFirstName || singleNotification.first) === userDetails.firstName?.trim()) {
      return true;
    }

    if (singleNotification.userType === 'Freelancer') {
      return true
    }
    if (singleNotification.awardStatus === "Awarded" && singleNotification.applicationTitle) {
      return true;
    }
  
    if (singleNotification.awardStatus === "Not Awarded" && singleNotification.applicationTitle) {
      return true;
    }

    if (singleNotification.userType === 'Innovator' && (singleNotification?.applicationId || singleNotification?.projectId || singleNotification?.jobId)) {
      return true;
    }

    if (singleNotification.to === userDetails.username && userDetails.userType === "Innovator"){
      return true;
    }

    return false;
  }

  const AddHideShowFlagInNotification = (allNotification: Email[]) => {
    for (let index = 0; index < allNotification.length; index++) {
      allNotification[index].isShow = isNotificationValid(allNotification[index]);
    }

    setNotifications(allNotification)
  }

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`${APIS.NOTIFICATIONS}?username=${userDetails.username}`);
        const notificationsWithTimestamp = response.data.map((notification: Email) => ({
          ...notification,
          sentAt: new Date(notification.sentAt),
        })).sort((a: { sentAt: { getTime: () => number; }; }, b: { sentAt: { getTime: () => number; }; }) => b.sentAt.getTime() - a.sentAt.getTime());
        AddHideShowFlagInNotification(notificationsWithTimestamp);
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
    setValue('1');
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = async (notificationObj: Email) => {
    try {
      await axiosInstance.post(`${APIS.MARK_AS_READ}`, { id: notificationObj._id });
      setNotifications(prevNotifications => {
        return prevNotifications.map(notification =>
          notification._id === notificationObj._id ? { ...notification, read: true } : notification
        ).sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
      });
      if (notificationObj.exhibitionId) {
        window.open(`/view-exhibition?exhibitionId=${notificationObj.exhibitionId}`, '_blank');
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(APIS.LOGOUT);
      localStorage.clear();
      clearCookies();
      setProfilePhoto(null);
      dispatch(removeUser());
      router.push('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const openProjectTab = (notificationObj: Email) => {
    if (notificationObj.applicationId) {
      router.push(`/projects?applicationId=${notificationObj.applicationId}`);
    } else if (notificationObj.projectId || notificationObj.jobId) {
      router.push(`/projects?projectId=${notificationObj.projectId || notificationObj.jobId}`);
    }
  }


  const openMyProjectTab = (notificationObj: Email) => {
    if (notificationObj.applicationId) {
      router.push(`/myproject?applicationId=${notificationObj.applicationId}`);
    } else if (notificationObj.projectId || notificationObj.jobId) {
      router.push(`/myproject?projectId=${notificationObj.projectId || notificationObj.jobId}`);
    }
  }

  const openProposalTab = (notificationObj: Email) => {
    router.push(`/proposal`);
  }

  const handleProfileRedirect = () => {
    handleMenuClose();
    router.push('/editprofile');
  };

  const generateNotificationHtml = (notification: Email) => {
    const userName = `${userDetails.firstName} ${userDetails.lastName}`;
    const viewExhibitionUrl = `/view-exhibition?exhibitionId=${notification.exhibitionId}`;

    if (notification.applicationId && notification.status3) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            Your application "{notification.title}" has been {notification.status3} by "{notification.adminFirstName} {notification.adminLastName}". Click <a href="#" onClick={() => openProjectTab(notification)}>here</a> for more details.
          </Typography >
        </>
      );
    }


    if (notification.to === userDetails.username && userDetails.userType === "Admin" && notification.subject === "New Exhibition Interest") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            , A new user has shown interest in The Exhibition {notification.exhibitionName}. Please review their details in the system. Best regards, Team Attmans". Click <a href={viewExhibitionUrl} target="_blank">here</a> for more details.
          </Typography >
        </>
      );
    }

    if (notification.to === userDetails.username && userDetails.userType === "Admin" && notification.subject === "New Booth Interest") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            ,A new user has shown interest in The booth {notification.boothTitle}. Please review their details in the system. Best regards, Team Attmans. Click <a href={viewExhibitionUrl} target="_blank">here</a> for more details.
          </Typography >
        </>
      );
    }


    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Admin" && notification.subject === "Milestone submitted") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.first} {notification.last} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Admin" && notification.subject === "Milestone resubmitted") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.first} {notification.last} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Freelancer" && notification.adminStatus === "Admin Approved") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.adminFirstName} {notification.adminLastName} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }
    
    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Project Owner" && notification.adminStatus === "Admin Approved") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.adminFirstName} {notification.adminLastName} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Freelancer" && notification.adminStatus === "Project Owner Approved") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.adminFirstName} {notification.adminLastName} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Freelancer" && notification.adminStatus === "Admin Rejected") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.adminFirstName} {notification.adminLastName} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('milestone') && userDetails.userType === "Freelancer" && notification.adminStatus === "Project Owner Rejected") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.adminFirstName} {notification.adminLastName} has {notification.status} a milestone.
            <a href="#" onClick={() => openMyProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }



    if (notification.subject.toLowerCase().includes('proposal') && notification.subject == "Proposal submitted"){
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.first} {notification.last} has {notification.status} a proposal.
            <a href="#" onClick={() => openProposalTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    console.log("f1",notification.subject.toLowerCase().includes('proposal') && notification.status == "Proposal Under Review" && userDetails.userType === "Freelancer")
    if (notification.subject.toLowerCase().includes('proposal') && notification.status == "Proposal Under Review" && userDetails.userType === "Freelancer") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that your proposal has been approved by the Admin.
            <a href="#" onClick={() => openProposalTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject.toLowerCase().includes('proposal') && notification.status == "Rejected" &&  userDetails.userType === "Freelancer") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            "You have been notified that your proposal has been Rejected by the Admin."
            <a href="#" onClick={() => openProposalTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }


    if (notification.subject.toLowerCase().includes('proposal') && userDetails.userType == "Project Owner" && notification.status == "Proposal Under Review" ) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that a proposal has been submitted .
            <a href="#" onClick={() => openProposalTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view.
          </Typography >
        </>
      );
    }

    if (notification.subject === 'New Project Created') {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that "{notification.first} {notification.last}" has created a project.
            <a href="#" onClick={() => openProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view projects "{notification.title}".
          </Typography >
        </>
      );
    }

    console.log("wwe",notification.status && userDetails.userType == "Innovator");
    if (notification.status && userDetails.userType == "Innovator") {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            Your booth "{notification.title}" request for exhibition is {notification.status} by "{notification.exhibitionUserFirstName} {notification.exhibitionUserLastName}". Click <a href={viewExhibitionUrl} target="_blank">here</a> for more details.
          </Typography >
        </>
      );
    }

    console.log('booth',notification.boothUsername)
    if (notification.boothUsername) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified that {notification.boothUsername} has requested to participate in the Exhibition "{notification.title}". Click <a href={viewExhibitionUrl} target="_blank">here</a> to approve/reject.
          </Typography >
        </>
      );
    }

    if (notification.status2) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            Your project "{notification.title}" has been {notification.status2} by {notification.adminFirstName} {notification.adminLastName}.
            <a href="#" onClick={() => openProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view projects.
          </Typography >
        </>
      );
    }

    if (notification.notifType === 'Apply Create' && (userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') && (notification.adminFirstName || notification.first) === userDetails.firstName.trim()) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been notified for new application submitted for the Project: {notification.title}.&nbsp;<a href="#" onClick={() => openProjectTab(notification)} style={{ color: 'blue', cursor: 'pointer' }}>Click here</a> to view projects.
          </Typography>
        </>
      );
    }
    console.log("freelancer",notification.userType === 'Freelancer')
    if (notification.userType === 'Freelancer') {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear Freelancers,<br />
            A project "{notification.title}" has been created for you.<br />
            Please check the details and proceed with the next steps.Click <a href="#" onClick={() => openProjectTab(notification)}>here</a>.
          </Typography>
        </>
      );
    }
    if (notification.awardStatus === "Awarded" && notification.applicationTitle) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear Applicant,<br />
            Congratulations! Your application for the job titled "{notification.applicationTitle}" has been awarded.
            <br />Thank you for your interest and effort. Click <a href="#" onClick={() => openProjectTab(notification)}>here</a> for more details.
          </Typography>
        </>
      );
    }
  
    if (notification.awardStatus === "Not Awarded" && notification.applicationTitle) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear Applicant,<br />
            Thank you for applying for the job titled "{notification.applicationTitle}". Unfortunately, your application was not selected for this opportunity.
            <br />We encourage you to apply for other roles or opportunities with us in the future.
          </Typography>
        </>
      );
    }

    if (notification.userType === 'Innovator' && (notification?.applicationId || notification?.projectId || notification?.jobId)) {
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear Innovators,<br />
            A project "{notification.title}" has been created for you. <br />
            Please check the details and proceed with the next steps.Click <a href="#" onClick={() => openProjectTab(notification)}>here</a>
          </Typography>
        </>
      );
    }
    console.log('inno',notification.to === userDetails.username && userDetails.userType === "Innovator")
    if (notification.to === userDetails.username && userDetails.userType === "Innovator"){
      console.log('inno',notification.to === userDetails.username && userDetails.userType === "Innovator")
      return (
        <>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Dear {userName},<br />
            You have been invited to participate in the exhibition "{notification.title}". Click <a href={viewExhibitionUrl} target="_blank">here</a> to participate.
          </Typography>
        </>
      );
    }
  };


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      PaperProps={{
        style: {
          width: '300px',
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          marginTop: '-5px',
        },
        sx: {
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 22,
            width: 11,
            height: 11,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

        <Typography variant="h6">{userDetails.firstName} {userDetails.lastName}</Typography>
        <Typography variant="body2" color="textSecondary">{userDetails.userType}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleProfileRedirect}>
        <Typography variant="body2">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Typography variant="body2">Log out</Typography>
      </MenuItem>
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

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" indicatorColor='secondary' textColor='secondary'>
              <Tab label="Unread" value="1" sx={{ fontSize: 12 }} />
              <Tab label="Read" value="2" sx={{ fontSize: 12 }} />
            </TabList>
          </Box>
          <TabPanel value="1">
            {notifications.filter(notification => !notification.read && notification.isShow).length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
                {notifications.filter(notification => !notification.read && notification.isShow).map((notification, index) => (
                  <React.Fragment key={notification._id}>
                    <MenuItem
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        whiteSpace: 'normal',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        backgroundColor: 'grey.200',
                      }}
                    >
                      {/* <Typography variant="body2" sx={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize() }} /> */}
                      {generateNotificationHtml(notification)}
                      <IconButton size="small" color="inherit">
                        <CircleIcon fontSize="inherit" sx={{ fontSize: '0.6rem' }} />
                      </IconButton>
                    </MenuItem>
                    {index < notifications.filter(notification => !notification.read && notification.isShow).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="2">

            {notifications.filter(notification => notification.read && notification.isShow).length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
                {notifications.filter(notification => notification.read && notification.isShow).map((notification, index) => (
                  <React.Fragment key={notification._id}>
                    <MenuItem
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        whiteSpace: 'normal',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      {/* <Typography variant="body2" sx={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateNotificationHtml(notification)) }} /> */}
                      {generateNotificationHtml(notification)}
                      <IconButton size="small" color="inherit">
                        <DoneAllIcon fontSize="small" />
                      </IconButton>
                    </MenuItem>
                    {index < notifications.filter(notification => notification.read && notification.isShow).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </TabPanel>
        </TabContext>




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
          <Badge badgeContent={notifications.filter(notification => !notification.read && notification.isShow).length} color="error">
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
          '@media (max-width: 767px)': {
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
              <Badge badgeContent={notifications.filter(notification => !notification.read && notification.isShow).length} color="error">
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
              <CommonAvatar name={`${userDetails.firstName} ${userDetails.lastName}`} url={`${SERVER_URL}/${profilePhoto}`}></CommonAvatar>
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
