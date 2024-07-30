import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
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

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  apply: Apply | null;
}

const ApproveDialogForApply: React.FC<ApproveDialogProps> = ({
  open,
  onClose,
  onApprove,
  apply,
}) => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onApprove();
        onClose();
      } catch (error) {
        console.error('Approval failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Approve Project</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure you want to approve this Project  "{apply?.title}"?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{background:'grey'}}>
            Cancel
          </Button>
          <Button type="submit" color="primary" autoFocus>
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Approve'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApproveDialogForApply;
