import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, Button, IconButton, Card, CardContent, Typography, Box, Divider, Tooltip, DialogContentText, DialogActions } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { APIS } from '@/app/constants/api.constant';
import ApproveDialogForApply from '../applyapprove/applyapprove';
import RejectDialogForApply from '../applyreject/applyreject';
import StatusFilter from '../filter/filter';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import ApplyDetailsDialog from '../projectsDetails/projectDetails';
import booth from '../booth/booth';
import AddComment from '../projectComment/projectComment';
import JobDetail from '../projectCommentCard/projectCommentCard';
import ConfirmCloseBox from '../All_ConfirmationBox/ConfirmCloseBox';
import ConfirmationDialog from '../All_ConfirmationBox/ConfirmationDialog';
import ConfirmationDialogWithCommentForCancel from '../All_ConfirmationBox/ConfirmationDialogWithCommentForCancel';
import UserDrawer from '../UserNameSeperate/UserDrawer';



export interface Job {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  Expertiselevel: string;
  TimeFrame: string | null;
  Category: string[];
  Subcategorys: string[];
  DetailsOfInnovationChallenge: string;
  firstName: string,
  lastName: string,
  Sector: string;
  AreaOfProduct: string;
  ProductDescription: string;
  username: string;
  SelectService: string;
  Objective: string;
  Expectedoutcomes: string;
  IPRownership: string;
  currency: string;
  status: string;
  rejectComment?: string;
  userId?: UserSchema;
  createdAt?: string;
}

interface Milestone {
  scopeOfWork: string;
  milestones: string[];
}

interface Apply {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  currency: string;
  TimeFrame: string | null;
  rejectComment: string;
  status: string;
  firstName: string;
  lastName: string;
  username: string;
  jobId: string;
  availableSolution: string;
  SolutionUSP: string;
}


export interface ProjectDrawerProps {
  viewingJob: Job | null;
  setViewingJob: React.Dispatch<React.SetStateAction<Job | null>>;
  userType: string;
  handleApproveDialogOpen: (job: Job) => void;
  handleRejectDialogOpen: (job: Job) => void;
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  viewingJob,
  setViewingJob,
  userType,
  handleApproveDialogOpen,
  handleRejectDialogOpen,
}) => {
  const isApproved = viewingJob?.status === 'Approved';
  const isRejected = viewingJob?.status === 'Rejected';
  const [filter, setFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [applications, setApplications] = useState<Apply[]>([]);
  const [selectedApply, setSelectedApply] = useState<Apply | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState<{ open: boolean; apply: Apply | null }>({ open: false, apply: null });
  const [rejectDialogOpen, setRejectDialogOpen] = useState<{ open: boolean; apply: Apply | null }>({ open: false, apply: null });
  const [buttonsHidden, setButtonsHidden] = useState<{ [key: string]: boolean }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const currentUser = userDetails.username;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);



  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    if (viewingJob?._id) {
      try {
        const response = await axios.get(`${APIS.APPLY}/jobId/${viewingJob._id}`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
  }, [viewingJob]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setDrawerOpen(true);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      if (!applicationId) return;
      await axios.post(`${APIS.APPLY}/approve/${applicationId}`);
      fetchApplications();
      setFilter('Approved');
      setButtonsHidden(prev => ({ ...prev, [applicationId]: true }));
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string, comment: string) => {
    try {
      const rejectComment = comment;
      if (rejectComment) {
        await axios.post(`${APIS.APPLY}/reject/${applicationId}`, { rejectComment });
        fetchApplications();
        setFilter('Rejected');
        setButtonsHidden(prev => ({ ...prev, [applicationId]: true }));
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };


  const filteredApplications = applications.filter(app => {
    if (filter === 'All') return true;
    return app.status === filter;
  }).filter(app => {
    if (userType === 'Project Owner') {
      return (app.status === 'Approved' || app.status === 'Awarded') && currentUser === viewingJob?.username;
    }
    if (userType === 'Innovators' || userType === 'Freelancer') {
      return app.username === currentUser;
    }
    return true;
  });

  const handleCommentSubmitted = () => {
    fetchApplications();
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser('');
  };

  const canAddComment = userType === 'Project Owner' && viewingJob?.username === currentUser ||
    userType === 'Admin' ||
    (userType === 'Innovators' || userType === 'Freelancer') && filteredApplications.some(app => app.username === currentUser && app.status === 'Approved' || app.status === 'Awarded');

  const handleReward = async (applicationId: string, Comment: string) => {
    try {
      if (!applicationId) return;
      console.log("applicationId", applicationId);


      // First, award the selected application
      await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
        jobId: viewingJob?._id, // Include jobId in the payload
        Comment
      });

      // Update all other applications to "Not Awarded"
      const updatedApplications = applications.map((app) =>
        app._id === applicationId
          ? { ...app, status: 'Awarded' }
          : { ...app, status: 'Not Awarded' }
      );


      setApplications(updatedApplications);

      // Hide all the buttons
      setButtonsHidden((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = true;
        });
        return updated;
      });
    } catch (error) {
      console.error('Error rewarding application:', error);
    }
  };

  const handleOpenConfirmationDialog = (applicationId: string) => {
    console.log("applicationId", applicationId);

    setCurrentApplicationId(applicationId);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setCurrentApplicationId(null);
  };

  const handleConfirm = (comment: string) => {
    if (currentApplicationId) {
      // Perform the action with currentApplicationId
      console.log(`Awarding application with ID: ${currentApplicationId}`);
      handleReward(currentApplicationId, comment)
      // Close the dialog after confirming
      handleCloseConfirmationDialog();
    }
  };



  // close conformation 
  const handleCloseClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = async (id: string, comment: string) => {
    setConfirmOpen(false);
    try {
      // Send the POST request to close the project, including the ID in the URL
      await axios.post(`${APIS.CLOSED_BY_ADMIN}/${id}`, {
        comment,     // Include the comment in the request body
        status: 'Project Closed by Admin' // Include the status in the request body
      });

      // Optionally handle the response or update UI
      console.log('Project successfully closed');
    } catch (error) {
      // Handle error (e.g., display an error message)
      console.error('Error closing the project:', error);
    }
  };

  const handleCancelClose = () => {
    setConfirmOpen(false);
  };



  ////////////////////////////////////


  const handleCancelClick2: () => void = () => {
    console.log('Cancel button clicked');
    setIsDialogOpen(true);
    console.log('isDialogOpen:', isDialogOpen);
  };



  const handleConfirmDialog2 = async (id: string, comment: string) => {
    console.log('User comment:', comment);
    // Add your logic here, e.g., cancel an operation, submit the comment, etc.
    setIsDialogOpen(false);

    try {
      // Send the POST request to close the project, including the ID in the URL
      await axios.post(`${APIS.CLOSED_BY_ADMIN}/${id}`, {
        comment,     // Include the comment in the request body
        status: 'Approved' // Include the status in the request body
      });

      // Optionally handle the response or update UI
      console.log('Project successfully closed');
    } catch (error) {
      // Handle error (e.g., display an error message)
      console.error('Error closing the project:', error);
    }
  };

  const handleCloseDialog2 = () => {
    setIsDialogOpen(false);
  };


  return (
    <>
      <Dialog
        open={!!viewingJob}
        onClose={() => setViewingJob(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            height: '100%',
            overflow: 'hidden',
            p: 2,
            backgroundColor: '#f9f9f9',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '25px' }}>
            Project Details Information
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setViewingJob(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewingJob && (
            <Box sx={{pt: 1}}>
              {isApproved && <Chip label="Approved" variant="outlined" sx={{ borderColor: 'green', color: 'green', borderRadius: '16px', float: 'right', mb: 2 }} />}
              {isRejected && <Chip label="Rejected" variant="outlined" sx={{ borderColor: 'red', color: 'red', borderRadius: '16px', float: 'right', mb: 2 }} />}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={userType === "Admin" ? 6 : 12}>
                  <TextField
                    label="Title"
                    value={viewingJob.title}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {userType === "Admin" ? <Grid item xs={12} sm={6}>
                  <TextField
                    onClick={() => handleUserClick(viewingJob?.userId?.username || "")}
                    label="Project Owner"
                    value={`${viewingJob?.userId?.firstName} ${viewingJob?.userId?.lastName}`}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2, cursor: "pointer" }}
                  />
                </Grid>: ''}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Select Service"
                    value={viewingJob.SelectService}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created Date"
                    value={dayjs(viewingJob.createdAt).format('MMMM D, YYYY h:mm A')}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Description"
                    value={viewingJob.description}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expertise Level"
                    value={viewingJob.Expertiselevel}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {viewingJob.SelectService[0] === 'Innovative product' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Details Of Innovation Challenge"
                        value={viewingJob.DetailsOfInnovationChallenge}
                        fullWidth
                        multiline
                        color='secondary'
                        aria-readonly
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Sector"
                        value={viewingJob.Sector}
                        fullWidth
                        color='secondary'
                        aria-readonly
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Area Of Product"
                        value={viewingJob.AreaOfProduct}
                        fullWidth
                        color='secondary'
                        aria-readonly
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Product Description"
                        value={viewingJob.ProductDescription}
                        fullWidth
                        multiline
                        color='secondary'
                        aria-readonly
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Budget"
                    value={`${viewingJob.currency === 'USD' ? '$' : '₹'} ${viewingJob.Budget}`}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    value={viewingJob.Category.join(', ')}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Subcategories"
                    value={viewingJob.Subcategorys.join(', ')}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Objective"
                    value={viewingJob.Objective}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expected Outcomes"
                    value={viewingJob.Expectedoutcomes}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="IPR Ownership"
                    value={viewingJob.IPRownership}
                    fullWidth
                    multiline
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {viewingJob.rejectComment && (
                  <Grid item xs={12}>
                    <Box sx={{ borderRadius: '5px', backgroundColor: 'error.light', p: 2 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'white' }}>
                        <b>Rejection Comment:</b> {viewingJob.rejectComment}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>


              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {userType === 'Admin' && viewingJob.status !== 'Approved' && viewingJob.status !== 'Rejected' && viewingJob.status !== 'Project Closed by Admin' && viewingJob.status !== 'Project Finished and close' && (
                  <>
                    <Button sx={{mr: 2}} onClick={() => handleApproveDialogOpen(viewingJob)}>
                      Approve
                    </Button>
                    <Button onClick={() => handleRejectDialogOpen(viewingJob)}>
                      Reject
                    </Button>
                  </>
                )}
              </Box>


              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {userType === 'Admin' && (viewingJob.status === 'Project Closed by Admin' || viewingJob.status === 'Project Finished and close') && (
                  <>
                    <Button sx={{ mr: 1 }} onClick={handleCancelClick2}>Cancel</Button>
                    <Button onClick={handleCloseClick}>Close</Button>
                  </>
                )}

                {/* Render the ConfirmCloseBox */}
                <ConfirmCloseBox
                  open={confirmOpen}
                  onClose={handleCancelClose}
                  onConfirm={handleConfirmClose}
                  id={viewingJob._id || 'default-id'}
                />

                <ConfirmationDialogWithCommentForCancel
                  open={isDialogOpen}
                  onClose={handleCloseDialog2}
                  onConfirm={handleConfirmDialog2}
                  id={viewingJob._id || 'default-id'}

                />

              </Box>


              <Divider orientation="horizontal" flexItem />

              <Box sx={{ position: 'relative', top: '30px', marginBottom: '20px' }}>
                <DialogTitle sx={{ fontSize: '25px' }}>
                  Applications for Project
                </DialogTitle>
              </Box>

              {(userType === 'Admin') && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, position: 'relative', top: '20px', right: '15%' }}>
                  <StatusFilter
                    value={filter}
                    onChange={(event, newStatus) => {
                      if (newStatus !== null) {
                        setFilter(newStatus);
                      }
                    }}
                    options={["All", "Pending", "Approved", "Rejected", "Awarded", "Not Awarded"]}
                  />
                </Box>
              )}

              <Box p={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <Card
                      key={app._id}
                      sx={{
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 'auto',
                      }}
                    >
                      <CardContent sx={{ flex: 1 }}>


                        <Chip
                          label={app.status}
                          variant="outlined"
                          sx={{
                            borderColor: app.status === 'Approved'
                              ? 'green'
                              : app.status === 'Rejected'
                                ? 'red'
                                : app.status === 'Awarded'
                                  ? 'blue'
                                  : app.status === 'Not Awarded'
                                    ? 'grey'
                                    : 'default',
                            color: app.status === 'Approved'
                              ? 'green'
                              : app.status === 'Rejected'
                                ? 'red'
                                : app.status === 'Awarded'
                                  ? 'blue'
                                  : app.status === 'Not Awarded'
                                    ? 'grey'
                                    : 'default',
                            borderRadius: '16px',
                            float: 'right',
                            mb: 2,
                          }}
                        />

                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {app.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          <b>Applied User:</b> 
                          <a
                                href="javascript:void(0);"
                                onClick={(e) => {
                                  handleUserClick(app?.username || "")
                                }}
                                style={{
                                  textDecoration: 'underline',
                                  color: '#1976d2',
                                  fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
                                }}
                              >{app.firstName} {app.lastName}
                              </a>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          <b>Budget:</b> {app.currency === 'USD' ? '$' : '₹'} {app.Budget}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          <b>Time Frame:</b> {app.TimeFrame ? dayjs(app.TimeFrame).format('MMMM D, YYYY h:mm A') : 'N/A'}
                        </Typography>

                        {userDetails && (
                          (userType === 'Admin' ||
                            userType === 'Project Owner' ||
                            (userType === 'Innovators' || userType === 'Freelancer') &&
                            filteredApplications.some((filteredApp) => filteredApp.username === currentUser && filteredApp._id === app._id))
                        ) && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedApply(app);
                                  setDialogOpen(true);
                                }}
                                style={{
                                  textDecoration: 'underline',
                                  color: '#1976d2',
                                  fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
                                }}
                              >
                                View Details
                              </a>
                            </Box>
                          )}

                      </CardContent>
                      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>

                        <div>
                          {app.status !== 'Awarded' && userType === 'Project Owner' && (
                            <Button variant="contained" color="primary" onClick={() => handleOpenConfirmationDialog(app._id!)}>
                              Award
                            </Button>
                          )}
                        </div>


                        {app.status !== 'Approved' &&
                          app.status !== 'Rejected' &&
                          app.status !== 'Awarded' &&
                          app.status !== 'Not Awarded' &&
                          userType === 'Admin' && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setApproveDialogOpen({ open: true, apply: app });
                                }}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                  setRejectDialogOpen({ open: true, apply: app });
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                      </Box>
                    </Card>
                  ))
                ) : (
                  <Typography>No applications found.</Typography>
                )}
              </Box>
            </Box>
          )}
          <>

            {approveDialogOpen.open && (
              <ApproveDialogForApply
                open={approveDialogOpen.open}
                onClose={() => setApproveDialogOpen({ open: false, apply: null })}
                onApprove={async () => {
                  if (approveDialogOpen.apply?._id) {
                    await handleApprove(approveDialogOpen.apply._id);
                  }
                }}
                apply={approveDialogOpen.apply}
              />
            )}

            {rejectDialogOpen.open && (
              <RejectDialogForApply
                open={rejectDialogOpen.open}
                onClose={() => setRejectDialogOpen({ open: false, apply: null })}
                onReject={async (jobId: string, comment: string) => {
                  if (rejectDialogOpen.apply?._id) {
                    await handleReject(jobId, comment);
                  }
                }}
                apply={rejectDialogOpen.apply}
              />
            )}

            {selectedApply && (
              <ApplyDetailsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                apply={selectedApply}
                jobId={viewingJob?._id || ''}
                canAddComment={canAddComment}
                onCommentSubmitted={handleCommentSubmitted}
              />
            )}
          </>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={handleCloseConfirmationDialog}
        onConfirm={handleConfirm}
        message="Are you sure you want to award this application?"
      />

      {selectedUser ? (
        <UserDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          username={selectedUser}
        />
      ) : ""}
    </>
  );
};

export default ProjectDrawer;