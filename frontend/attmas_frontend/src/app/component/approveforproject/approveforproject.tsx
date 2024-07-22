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

interface Job {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  Expertiselevel: string;
  TimeFrame: string | null;
  Category: string[];
  Subcategorys: string[];
  SelectService: string;
  Objective: string;
  Expectedoutcomes: string;
  IPRownership: string;
  status: string;
}

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  job: Job | null;
}

const ApproveDialogForProject: React.FC<ApproveDialogProps> = ({
  open,
  onClose,
  onApprove,
  job,
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
            Are you sure you want to approve this Project "{job?.title}"?
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

export default ApproveDialogForProject;
