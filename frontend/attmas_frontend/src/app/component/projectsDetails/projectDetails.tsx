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
  CircularProgress,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import JobDetail from '../projectCommentCard/projectCommentCard';
import AddComment from '../projectComment/projectComment';
import { APIS } from '@/app/constants/api.constant';
import ConfirmationDialog from '../All_ConfirmationBox/ConfirmationDialog';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import UserDrawer from '../UserNameSeperate/UserDrawer';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import { APPLY_STATUSES, PROPOSAL_STATUSES } from '@/app/constants/status.constant';
import axiosInstance from '@/app/services/axios.service';
import { ProductForBooth } from '../ProductTableForBooth';
import NewProductTable from '../all_Profile_component/NewProductTable';
import { Product } from '../ProductTable';
import { pubsub } from '@/app/services/pubsub.service';
import { translationsforApplyDetails } from '../../../../public/trancation';




export interface Milestone {
  scopeOfWork: string;
  milestones: {
    isCommentSubmitted: boolean;
    name: {
      text: string;
      timeFrame: string | null;
    };
    status: string;
    submittedAt: string;
    adminStatus:
    | 'Pending'
    | 'Admin Approved'
    | 'Admin Rejected'
    | 'Project Owner Approved'
    | 'Project Owner Rejected';
    adminComments: string[];
    resubmissionComments: string[];
  }[];
  isCommentSubmitted?: boolean;
  status?: string;
  milstonSubmitcomments: string[];
}

interface Proposal {
  _id: string;
  projectTitle: string;
  Status: string;
  // Add other fields as needed
  firstname: string;
  lastname: string;
  userId?: UserSchema;
  userName: string;
  applyId: string;
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
  username: string;
  products?: ProductForBooth[];
  applyType?: "FreelancerApply" | "InnovatorsApply";
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  apply: Apply | null;
  jobId: string;
  canAddComment: boolean;
  onCommentSubmitted: () => void;

}

interface WorkExprience {
  gender: string
  qualification: string;
  organization: string;
  sector: string;
  workAddress: string;
  designation: string;
  userType: string;
  productToMarket: string;
  products: Product[];
  hasPatent: string;
  patentDetails: string;
  username: string;
  userId: string;
}

const ApplyDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ open, onClose, apply, jobId, canAddComment, onCommentSubmitted }) => {
  const [jobDetailKey, setJobDetailKey] = useState<number>(0);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [applications, setApplications] = useState<Apply[]>([]);
  const [isAwardButtonVisible, setIsAwardButtonVisible] = useState(true);
  const [workExperience, setWorkExperience] = React.useState<WorkExprience | null>(null);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [subcategories, setSelectedValues] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState([]);

  const [buttonsHidden, setButtonsHidden] = useState<{ [key: string]: boolean }>({});

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  

  const language = userDetails.language || 'english';
  const t = translationsforApplyDetails[language as keyof typeof translationsforApplyDetails] || translationsforApplyDetails.english;


  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [checkedProducts, setCheckedProducts] = useState<ProductForBooth[]>([]);
  const [commentsFetched, setCommentsFetched] = useState<boolean>(false);
  const [resubmitComment, setResubmitComment] = useState<string>('');
  const [isResubmitting, setIsResubmitting] = useState<boolean>(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);


  const adminStatuses = [
    'Admin Approved'
    , 'Admin Rejected'
    , 'Project Owner Approved'
    , 'Project Owner Rejected'];

  useEffect(() => {
    const fetchMilestones = () => {
      if (apply?._id) {
        axiosInstance.get(`${APIS.MILESTONES}/apply/${apply._id}`)
          .then(response => {
            setMilestones(response.data);
          })
          .catch(error => console.error('Error fetching milestones:', error));
      }
    };
    fetchMilestones();

    pubsub.subscribe('MilstonRefetched', fetchMilestones);

    return () => {
      pubsub.unsubscribe('MilstonRefetched', fetchMilestones);
    };
  }, [apply]);

  React.useEffect(() => {
    if (open && apply?.username) {
      const fetchWorkExperience = async () => {
        try {
          const response = await axiosInstance.get(`/profile/profileByUsername2?username=${apply.username}`);
          setWorkExperience(response.data);
        } catch (error) {
          console.error('Error fetching Work Experience:', error);
          setFetchError('Failed to fetch work experience.');
        } finally {
          setLoading(false);
        }
      };
      fetchWorkExperience();
    }
  }, [open, apply?.username]);

  React.useEffect(() => {
    if (apply?.username) {
      const fetchUserProfile = async () => {
        try {
          const response = await axiosInstance.get(`/profile/profileByUsername3?username=${apply.username}`);
          const userData = response.data;
          setCategories(userData.categories || []);
          setSelectedValues(userData.subcategories || []);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setFetchError('Failed to fetch user profile');
        }
      };

      fetchUserProfile();
    }
  }, [apply?.username]);




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

  const fetchAllProposals = useCallback(async () => {
    if (userDetails.userType === 'Admin' || userDetails.userType === 'Project Owner') {
      try {
        const response = await axiosInstance.get(APIS.GET_ALL_PROPOSALS);
        setProposals(response.data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    }
  }, [userDetails.userType]);

  useEffect(() => {
    fetchAllProposals();
    // Fetch proposals if user is Admin
  }, [fetchAllProposals]);

  const handleReward = async (applicationId: string, Comment: string) => {
    try {
      if (!applicationId) return;

      await axiosInstance.post(`${APIS.APPLYFORREWARD}/reward/${applicationId}`, {
        jobId, // Include jobId in the payload
        Comment
      });

      // Update all other applications to "Not Awarded"
      const updatedApplications = applications.map((app) =>
        app._id === applicationId
          ? { ...app, status: 'Awarded' }
          : { ...app, status: 'Not Awarded' }
      );

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


  const handleResubmitMilestone = async (applyId: string, milestoneIndex: number, comment: string) => {
    try {
      setIsResubmitting(true);
      await axiosInstance.post(`${APIS.MILESTONES}/resubmit`, {
        applyId,
        milestoneIndex,
        resubmitComment: comment
      });
      pubsub.publish('MilstonRefetched', { Message: 'Milestone Resubmitted' });
    } catch (error) {
      console.error('Error resubmitting milestone:', error);
    } finally {
      setIsResubmitting(false);
    }
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
          {/* Apply Details */}
          {t.applyDetails}
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
                <Typography variant="body1" color="text.secondary" sx={{ color: getStatusColor(apply.status), textAlign: 'right', fontSize: 14, mb: 0.5 }}>
                  Status: {apply.status}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ color: getStatusColor(apply.status), textAlign: 'right', fontSize: 14, mb: 0.5 }}>
                  Timeframe: {dayjs(apply.TimeFrame).format(DATE_FORMAT)}
                </Typography>
                {userDetails.userType === 'Admin' && <Typography variant="body2" color="textSecondary" sx={{ mb: 1, ml: 2, textAlign: 'right', fontSize: 14 }}>
                  {/* <b>Applied User: &nbsp;</b> */}
                  <b>{t.appliedUser} &nbsp;</b>
                  <a
                    href="javascript:void(0);"
                    onClick={(e) => {
                      handleUserClick(apply?.userId?.username || "")
                    }}
                    style={{
                      textDecoration: 'underline',
                      color: '#1976d2',
                      fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
                    }}
                  >{apply?.userId?.firstName} {apply?.userId?.lastName}
                  </a>
                </Typography>}
              </Box>
              <Grid container spacing={2} flexDirection={'column'}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label={t.title}
                    value={apply.title}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label={t.description}
                    value={apply.description}
                    multiline
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t.budget}
                    value={`${apply.currency === 'USD' ? '$' : '₹'}${apply.Budget}`}
                    fullWidth
                    color='secondary'
                    aria-readonly
                    sx={{ mb: 1 }}
                  />
                </Grid>

                {apply.applyType === 'InnovatorsApply' && (
                  <Box sx={{ marginBottom: '15px' }}>
                    <NewProductTable
                      products={apply?.products}
                      hideActions={true}
                      onEdit={() => {
                        throw new Error('Function not implemented.');
                      }}
                      onDelete={() => {
                        throw new Error('Function not implemented.');
                      }} onView={function (product: Product): void {
                        throw new Error('Function not implemented.');
                      }}
                    />
                  </Box>
                )}

                {(apply.applyType === 'InnovatorsApply' && workExperience) && (
                  <Paper elevation={3} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Qualification"
                          value={workExperience.qualification}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Organization"
                          value={workExperience.organization}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Sector"
                          value={workExperience.sector}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Work Address"
                          value={workExperience.workAddress}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ marginBottom: '40px' }}>
                        <TextField
                          fullWidth
                          label="Designation"
                          value={workExperience.designation}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                          color="secondary"
                        />
                      </Grid>



                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Do you have a patent?"
                          value={workExperience.hasPatent}
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                        />
                      </Grid>
                      {workExperience.hasPatent === 'Yes' && (
                        <Grid item xs={12} >
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Patent Details"
                            value={workExperience.patentDetails}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                          />
                        </Grid>
                      )}
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Categories
                        </Typography>
                        <TextField
                          fullWidth
                          sx={{ width: '100%' }}
                          value={categories.join(', ')}
                          variant="outlined"
                          multiline
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Subject Matter Expertise
                        </Typography>
                        <TextField
                          fullWidth
                          sx={{ width: '100%' }}
                          value={subcategories.join(', ')}
                          variant="outlined"
                          multiline
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}

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
                              label={t.scopeOfWork}
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
                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          <TextField
                                            label={t.milestone}
                                            value={m.name.text || 'No text available'}
                                            multiline
                                            fullWidth
                                            color='secondary'
                                            aria-readonly
                                            sx={{ mb: 2 }}
                                          />
                                        </Grid>

                                        <Grid item xs={12}>
                                          <Grid container spacing={3}>
                                            <Grid item xs={12} sm={5}>
                                              <TextField
                                                label={t.milestoneDeadline}
                                                value={m.name.timeFrame ? dayjs(m.name.timeFrame).format(DATE_FORMAT) : 'No time frame available'}
                                                fullWidth
                                                color='secondary'
                                                aria-readonly
                                                sx={{ mb: 2 }}
                                              />
                                            </Grid>
                                            {(userDetails.userType === 'Admin' || userDetails.userType === 'Freelancer' || userDetails.userType === 'Innovator' || userDetails.userType === 'Project Owner') && m.status === 'Submitted' && (
                                              <Grid item xs={12} sm={5}>
                                                <TextField
                                                  label="Admin Status"
                                                  value={m.adminStatus || 'No admin status available'}
                                                  fullWidth
                                                  color='secondary'
                                                  aria-readonly
                                                  sx={{ mb: 2 }}
                                                />
                                              </Grid>
                                            )}
                                            {userDetails.userType === 'Admin' && m.status === 'Submitted' && (
                                              <>
                                                <Grid item xs={12} sm={5}>
                                                  <TextField
                                                    label="Status"
                                                    value={m.status || 'No status available'}
                                                    fullWidth
                                                    color='secondary'
                                                    aria-readonly
                                                    sx={{ mb: 2 }}
                                                  />
                                                </Grid>
                                                <Grid item xs={12} sm={5}>
                                                  <TextField
                                                    label="Submitted Date"
                                                    value={m.submittedAt ? dayjs(m.submittedAt).format(DATE_FORMAT) : 'No Submitted Date available'}
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

                                        {userDetails.userType === 'Admin' && m.status === 'Submitted' && (
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
                                        {userDetails.userType === 'Freelancer' && (m.adminStatus === 'Admin Rejected' || m.adminStatus === 'Project Owner Rejected') && (
                                          <>
                                            <Grid item xs={12}>
                                              <TextField
                                                label="Resubmission Comment"
                                                value={resubmitComment}
                                                onChange={(e) => setResubmitComment(e.target.value)}
                                                multiline
                                                color='secondary'
                                                fullWidth
                                                sx={{ mb: 2 }}
                                              />
                                              <Button
                                                onClick={() => handleResubmitMilestone(apply._id || "", index, resubmitComment)}
                                                variant="contained"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                                disabled={isResubmitting}
                                              >
                                                {isResubmitting ? (
                                                  <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                  'Resubmit'
                                                )}
                                              </Button>
                                            </Grid>
                                          </>
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
                {apply.applyType === 'FreelancerApply' && (<>
                  <Grid item xs={12}>
                    <TextField
                      label={t.otherSolutions}
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
                      label={t.solutionUSP}
                      value={apply.SolutionUSP}
                      fullWidth
                      multiline
                      color='secondary'
                      aria-readonly
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>)}
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

          {proposals
            .filter((proposal) => apply?._id === proposal.applyId && proposal.Status === PROPOSAL_STATUSES.proposalUnderReview)
            .map((proposal) => (
              userDetails.userType === 'Project Owner' &&
              apply?._id && apply?.status === APPLY_STATUSES.proposalUnderReview &&
              isAwardButtonVisible && (
                <Button
                  key={proposal._id}
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenConfirmationDialog(apply._id as string)}
                >
                  Award
                </Button>
              )
            ))}

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
