import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Grid,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';


interface Apply {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: string | null;
    rejectComment: string;
    status:string;
    firstName:string;
    lastName:string;
  }

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  apply: Apply | null;
}

const ApplyDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ open, onClose, apply }) => {

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
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ 
        '& .MuiDialog-paper': { 
          maxWidth: '50%', 
          maxHeight:'100%'
        } 
      }}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Project Details
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
             <Box sx={{ position: 'absolute', top: 16, right: 16 ,  '@media (max-width: 767px)': {
              position:'relative',top:'-10px',left:'5px'}}}>
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

              
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplyDetailsDialog;
