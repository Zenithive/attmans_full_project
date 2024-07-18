import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
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
  }

interface RemoveDialogProps {
  open: boolean;
  onClose: () => void;
  onRemove: () => Promise<void>;
  booth: Booth | null;
}

const RemoveDialog: React.FC<RemoveDialogProps> = ({ open, onClose, onRemove, booth }) => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onRemove();
        onClose(); 
      } catch (error) {
        console.error("Removel failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Dialog open={open} onClose={onClose}>
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>Approve Booth</DialogTitle>
      <DialogContent dividers>
        <p>Are you sure you want to Reject this booth "{booth?.title}"?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" autoFocus>
        {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reject'}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
  );
};

export default RemoveDialog;
