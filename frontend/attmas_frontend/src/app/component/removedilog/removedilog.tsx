import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';

interface Booth {
    _id: string;
    title: string;
    description: string;
    products: { name: string; description: string; productType: string; price: number; currency: string; }[];
    userId: {
      firstName: string;
      lastName: string;
    };
    status: string;
    exhibitionId: string;
    createdAt: string;
    rejectComment?:string;
  }

interface RemoveDialogProps {
  open: boolean;
  onClose: () => void;
  onRemove: (boothId: string, comment: string) => Promise<void>;
  booth: Booth | null;
}

const RemoveDialog: React.FC<RemoveDialogProps> = ({ open, onClose, onRemove, booth }) => {
  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (booth?._id) {
          console.log('Submitting comment:', values.comment);
          await onRemove(booth._id, values.comment);
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
      <DialogTitle>Reject Booth</DialogTitle>
      <DialogContent dividers>
        <p>
          Are you sure you want to reject this Booth "{booth?.title}"?
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
        <Button onClick={onClose} sx={{background:'grey', '&:hover': {
          background: 'grey' 
        }}} aria-label="Cancel rejection">
          Cancel
        </Button>
        <Button 
          type="submit" 
          color="primary" 
          autoFocus 
          aria-label="Reject booth"
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

export default RemoveDialog;
