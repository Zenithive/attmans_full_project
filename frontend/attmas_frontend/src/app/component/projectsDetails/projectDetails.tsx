import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  CardContent,
  Card,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import JobDetail from '../projectCommentCard/projectCommentCard';
import AddComment from '../projectComment/projectComment';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import ConfirmationDialog from '../All_ConfirmationBox/ConfirmationDialog';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import UserDrawer from '../UserNameSeperate/UserDrawer';



interface Milestone {
  scopeOfWork: string;
  milestones: {
    _id: string;
    isCommentSubmitted: boolean;
    name: {
      text: string;
      timeFrame: string | null;
    };
    status: string;
    submittedAt: string;
  }[];
  isCommentSubmitted?: boolean;
  status?: string;
  milstonSubmitcomments: string[];
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
  availableSolution: string;
  SolutionUSP: string;
  userId?: UserSchema;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  apply: Apply | null;
  jobId: string;
  canAddComment: boolean;
  onCommentSubmitted: () => void;

}


const ApplyDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ open, onClose, apply, jobId, canAddComment, onCommentSubmitted }) => {
  const [jobDetailKey, setJobDetailKey] = useState<number>(0);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [applications, setApplications] = useState<Apply[]>([]);
  const [isAwardButtonVisible, setIsAwardButtonVisible] = useState(true);

  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [buttonsHidden, setButtonsHidden] = useState<{ [key: string]: boolean }>({});

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [commentsFetched, setCommentsFetched] = useState<boolean>(false);

  useEffect(() => {
    if (apply?._id) {
      axios.get(`${APIS.MILESTONES}/apply/${apply._id}`)
        .then(response => {
          console.log("Fetched milestones:", response.data);
          setMilestones(response.data);
        })
        .catch(error => console.error('Error fetching milestones:', error));
    }
  }, [apply]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'black';
    }
  };

  const handleReward = async (applicationId: string, Comment: string) => {
    try {
      if (!applicationId) return;
      console.log("applicationId", applicationId);


      // First, award the selected application
      // await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`);
      // await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
      //   jobId, // Include jobId in the payload
      // });

      await axios.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
        jobId, // Include jobId in the payload
        Comment
      });

      // Update all other applications to "Not Awarded"
      const updatedApplications = applications.map((app) =>
        app._id === applicationId
          ? { ...app, status: 'Awarded' }
          : { ...app, status: 'Not Awarded' }
      );

      // Make an API call to update all applications' statuses on the server
      // await axios.post(`${APIS.NOTAWARED}/updateStatuses`, { applications: updatedApplications });

      // Update the local state with the new statuses
      setApplications(updatedApplications);
      // Hide the Award button
      setIsAwardButtonVisible(false);

      // Hide all the buttons
      // setButtonsHidden((prev) => {
      //   const updated = { ...prev };
      //   Object.keys(updated).forEach((key) => {
      //     updated[key] = true;
      //   });
      //   return updated;
      // });

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

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser('');
  };

  return (
    <>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '50%',
            maxHeight: '100%',
            '@media (max-width: 767px)': {
              maxWidth: '100%',
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Apply Details
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {apply && (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  '@media (max-width: 767px)': {
                    position: 'relative',
                    top: '-10px',
                    left: '5px',
                  },
                }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ color: getStatusColor(apply.status), textAlign: 'right' }}>
                  Status: {apply.status}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ color: getStatusColor(apply.status), textAlign: 'right' }}>
                  Date: {dayjs(apply.TimeFrame).format('MMMM D, YYYY h:mm A')}
                </Typography>
              </Box>
              <Grid container spacing={2} flexDirection={'column'}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Title"
                    value={apply.title}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Description"
                    value={apply.description}
                    multiline
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    onClick={() => handleUserClick(apply?.userId?.username || "")}
                    label="Applied User"
                    value={`${apply.firstName} ${apply.lastName}`}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Budget"
                    value={`${apply.currency === 'USD' ? '$' : '₹'}${apply.Budget}`}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {milestones.map((milestone, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Milestone
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              label="Scope of Work"
                              value={milestone.scopeOfWork}
                              multiline
                              fullWidth
                              color='secondary'
                              aria-readonly
                              sx={{ mb: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            {milestone.milestones && milestone.milestones.length > 0 ? (
                              milestone.milestones.map((m, index) => (
                                <Grid item xs={12} key={index}>
                                  <Card sx={{ marginBottom: '20px' }}>
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom>
                                        Milestone {index + 1}
                                      </Typography>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          <TextField
                                            label="Milestone"
                                            value={m.name.text || 'No text available'}
                                            multiline
                                            fullWidth
                                            color='secondary'
                                            aria-readonly
                                            sx={{ mb: 2 }}
                                          />
                                        </Grid>

                                        <Grid item xs={12}>
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                              <TextField
                                                label="Milestone Deadline Date"
                                                value={m.name.timeFrame ? dayjs(m.name.timeFrame).format('MM/DD/YYYY') : 'No time frame available'}
                                                fullWidth
                                                color='secondary'
                                                aria-readonly
                                                sx={{ mb: 2 }}
                                              />
                                            </Grid>
                                            {userDetails.userType === 'Admin' && (
                                              <>
                                                <Grid item xs={12} sm={4}>
                                                  <TextField
                                                    label="Status"
                                                    value={m.status || 'No status available'}
                                                    fullWidth
                                                    color='secondary'
                                                    aria-readonly
                                                    sx={{ mb: 2 }}
                                                  />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                  <TextField
                                                    label="Submitted Date"
                                                    value={m.submittedAt ? dayjs(m.submittedAt).format('MM/DD/YYYY') : 'No Submitted Date available'}
                                                    fullWidth
                                                    color='secondary'
                                                    aria-readonly
                                                    sx={{ mb: 2 }}
                                                  />
                                                </Grid>
                                              </>
                                            )}
                                          </Grid>
                                        </Grid>

                                        {userDetails.userType === 'Admin' && (
                                          <Grid item xs={12}>
                                            <TextField
                                              label="Comment"
                                              value={milestone.milstonSubmitcomments[index] || 'No comment submitted'}
                                              multiline
                                              fullWidth
                                              color='secondary'
                                              aria-readonly
                                              sx={{ mb: 2 }}
                                            />
                                          </Grid>
                                        )}
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>

                              ))
                            ) : (
                              <Typography>No milestones available</Typography>
                            )}
                          </Grid>


                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Other available solutions"
                      value={apply.availableSolution}
                      fullWidth
                      multiline
                      color='secondary'
                      aria-readonly
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Solution USP"
                      value={apply.SolutionUSP}
                      fullWidth
                      multiline
                      color='secondary'
                      aria-readonly
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>
                {apply.rejectComment && (
                  <Grid item xs={12}>
                    <Box sx={{ borderRadius: '5px', backgroundColor: 'error.light', p: 2 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'white' }}>
                        <b>Rejection Comment:</b> {apply.rejectComment}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {canAddComment && (
                <>
                  <Divider orientation="horizontal" flexItem sx={{ marginBottom: '30px' }} />
                  <Grid item xs={12} sm={12}>
                    <JobDetail key={jobDetailKey} jobId={jobId} applyId={apply._id} onCommentSubmitted={onCommentSubmitted} />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box
                      sx={{
                        backgroundColor: '#f5f5f5',
                        padding: 2,
                        borderRadius: 1,
                        marginTop: '20px',
                      }}
                    >
                      <AddComment
                        jobId={jobId}
                        applyId={apply._id}
                        onCommentSubmitted={() => {
                          onCommentSubmitted();
                          setJobDetailKey((prev) => prev + 1);
                        }}
                      />
                    </Box>
                  </Grid>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>

          {userDetails.userType === 'Project Owner' && apply?._id && isAwardButtonVisible && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenConfirmationDialog(apply._id as string)}
            >
              Award
            </Button>
          )}
          <Button
            onClick={onClose}
            sx={{
              color: 'white', // Set text color to white
              backgroundColor: '#757575',
              '&:hover': {
                backgroundColor: '#757575', // Darken the grey on hover
              },
            }}
          >
            Close
          </Button>

        </DialogActions>
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

export default ApplyDetailsDialog;
