import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Chip, Button, IconButton, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { APIS } from '@/app/constants/api.constant';
import ApproveDialogForApply from '../applyapprove/applyapprove';
import RejectDialogForApply from '../applyreject/applyreject';
import StatusFilter from '../filter/filter';

interface Job {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  Expertiselevel: string;
  TimeFrame: string | null;
  Category: string[];
  Subcategorys: string[];
  DetailsOfInnovationChallenge: string;
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
}

interface Apply {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  currency: string;
  TimeFrame: string | null;
  status?: string;
}

interface ProjectDrawerProps {
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
  handleRejectDialogOpen
}) => {
  const isApproved = viewingJob?.status === 'Approved';
  const isRejected = viewingJob?.status === 'Rejected';
  const [filter, setFilter] = useState<string>('All');
  const [applications, setApplications] = useState<Apply[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState<{ open: boolean; apply: Apply | null }>({ open: false, apply: null });
  const [rejectDialogOpen, setRejectDialogOpen] = useState<{ open: boolean; apply: Apply | null }>({ open: false, apply: null });
  const [buttonsHidden, setButtonsHidden] = useState<{ [key: string]: boolean }>({});

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

  const handleApprove = async (applicationId: string) => {
    try {
    if(!applicationId) return;
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
  });

  return (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <Box>
            {isApproved && <Chip label="Approved" variant="outlined" sx={{ borderColor: 'green', color: 'green', borderRadius: '16px', float: 'right', mb: 2 }} />}
            {isRejected && <Chip label="Rejected" variant="outlined" sx={{ borderColor: 'red', color: 'red', borderRadius: '16px', float: 'right', mb: 2 }} />}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  value={viewingJob.title}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Select Service"
                  value={viewingJob.SelectService}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  value={viewingJob.description}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expertise Level"
                  value={viewingJob.Expertiselevel}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              {viewingJob.SelectService === 'Innovative product' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Details Of Innovation Challenge"
                      value={viewingJob.DetailsOfInnovationChallenge}
                      fullWidth
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Sector"
                      value={viewingJob.Sector}
                      fullWidth
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Area Of Product"
                      value={viewingJob.AreaOfProduct}
                      fullWidth
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Product Description"
                      value={viewingJob.ProductDescription}
                      fullWidth
                      disabled
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
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  value={viewingJob.Category.join(', ')}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Subcategories"
                  value={viewingJob.Subcategorys.join(', ')}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Objective"
                  value={viewingJob.Objective}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expected Outcomes"
                  value={viewingJob.Expectedoutcomes}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="IPR Ownership"
                  value={viewingJob.IPRownership}
                  fullWidth
                  disabled
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {userType === 'Admin' && viewingJob.status !== 'Approved' && viewingJob.status !== 'Rejected' && (
                <>
                  <Button onClick={() => handleApproveDialogOpen(viewingJob)}>
                    Approve
                  </Button>
                  <Button onClick={() => handleRejectDialogOpen(viewingJob)}>
                    Reject
                  </Button>
                </>
              )}
            </Box>

            <Divider orientation="horizontal" flexItem />

             <Box sx={{position:'relative',top:'30px'}}>
                <DialogTitle>
                       Applications for Project
                </DialogTitle>
             </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 ,position:'relative',top:'40px',right:'15%'}}>
            <StatusFilter
            value={filter}
            onChange={(event, newStatus) => {
              if (newStatus !== null) {
                setFilter(newStatus);
              }
            }}
          />
            </Box>
            <Box p={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <Card
                    key={app._id}
                    sx={{
                      width: 300,
                      height: 182,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Chip
                        label={app.status}
                        variant="outlined"
                        sx={{
                            borderColor: app.status === 'Approved' ? 'green' : app.status === 'Rejected' ? 'red' : 'default',
                            color: app.status === 'Approved' ? 'green' : app.status === 'Rejected' ? 'red' : 'default',
                            borderRadius: '16px',
                            float: 'right',
                            mb: 2,
                        }}
                      />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {app.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        <b>Budget:</b> {app.currency === 'USD' ? '$' : '₹'} {app.Budget}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        <b>Time Frame:</b> {app.TimeFrame ? dayjs(app.TimeFrame).format('MMMM D, YYYY h:mm A') : 'N/A'}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 1 }}>
                    {app.status !== 'Approved' && app.status !== 'Rejected' && (
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
        </>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDrawer;
