import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';


interface Apply {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: string | null;
    status?: string;
  }

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onReject: (jobId: string, comment: string) => Promise<void>;
  apply: Apply | null;
}

const RejectDialogForApply: React.FC<RejectDialogProps> = ({
  open,
  onClose,
  onReject,
  apply,
}) => {
  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (apply?._id) {
          console.log('Submitting comment:', values.comment);
          await onReject(apply._id, values.comment);
          onClose();
        }
      } catch (error) {
        console.error('Rejection failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Reject Project</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure you want to reject this project "{apply?.title}"?
          </p>
          <TextField
            id="comment"
            name="comment"
            label="Comment"
            color='secondary' 
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            aria-label="Rejection comment"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} aria-label="Cancel rejection">
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            autoFocus 
            aria-label="Reject project"
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reject'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RejectDialogForApply;
