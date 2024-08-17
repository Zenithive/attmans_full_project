import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';

interface Booth {
    _id: string;
    title: string;
    description: string;
    products: { name: string; description: string; productType: string; productPrice: number; currency: string; }[];
    userId: {
      firstName: string;
      lastName: string;
    };
    status: string;
    exhibitionId: string;
    createdAt: string;
  }

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  booth: Booth | null;
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({ open, onClose, onApprove, booth }) => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onApprove();
        onClose(); 
      } catch (error) {
        console.error("Approval failed:", error);
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
          <p>Are you sure you want to approve this booth "{booth?.title}"?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" autoFocus>
          {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Approve'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApproveDialog;
