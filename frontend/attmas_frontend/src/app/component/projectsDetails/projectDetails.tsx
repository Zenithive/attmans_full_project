import React, { useState, useCallback } from 'react';
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
  milestones: Milestone[];
  availableSolution: string;
  SolutionUSP: string;
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '50%',
          maxHeight: '100%',
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
              <Typography variant="body1" color="text.secondary" sx={{ color: getStatusColor(apply.status) }}>
                Status: {apply.status}, Date: {dayjs(apply.TimeFrame).format('MMMM D, YYYY h:mm A')}
              </Typography>
            </Box>
            <Grid container spacing={2} flexDirection={'column'}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Title"
                  value={apply.title}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Description"
                  value={apply.description}
                  multiline
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Applied User"
                  value={`${apply.firstName} ${apply.lastName}`}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Budget"
                  value={`${apply.currency === 'USD' ? '$' : '₹'}${apply.Budget}`}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                {apply.milestones.map((milestone, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Milestone {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            label="Scope of Work"
                            value={milestone.scopeOfWork}
                            multiline
                            fullWidth
                            disabled
                            sx={{
                              mb: 2,
                             }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Milestones"
                            value={milestone.milestones}
                            multiline
                            fullWidth
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              {apply.availableSolution && (
                <Grid item xs={12}>
                  <TextField
                    label="Other available solutions"
                    value={apply.availableSolution}
                    fullWidth
                    multiline
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
                {apply.SolutionUSP && (
                <Grid item xs={12}>
                  <TextField
                    label="Solution USP"
                    value={apply.SolutionUSP}
                    fullWidth
                    multiline
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
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
                  <JobDetail key={jobDetailKey} jobId={jobId} applyId={apply._id}  onCommentSubmitted={onCommentSubmitted}/>
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
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplyDetailsDialog;
