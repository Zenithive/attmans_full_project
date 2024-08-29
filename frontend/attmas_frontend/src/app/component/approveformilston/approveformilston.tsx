import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';

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
    }[];
    isCommentSubmitted?: boolean;
    status?: string;
    milstonSubmitcomments: string[];
}

interface ApproveMilestoneDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (comment: string) => Promise<void>;
  milestone: Milestone | null;
}

const ApproveMilestoneDialog: React.FC<ApproveMilestoneDialogProps> = ({
  open,
  onClose,
  onApprove,
  milestone
}) => {
  const formik = useFormik({
    initialValues: { comment: '' },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (milestone) {
          await onApprove(values.comment);
        }
        onClose();
      } catch (error) {
        console.error('Approval failed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Approve Milestone</DialogTitle>
        <DialogContent dividers>
          <p>
          Are you sure you want to approve this milestone: "{milestone?.milestones[0]?.name.text}"?
          </p>
          <TextField
            name="comment"
            label="Comment"
            color="secondary"
            value={formik.values.comment}
            onChange={formik.handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ background: 'grey' }}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
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

export default ApproveMilestoneDialog;
