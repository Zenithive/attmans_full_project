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

interface RejectMilestoneDialogProps {
  open: boolean;
  onClose: () => void;
  onReject: (comment: string) => Promise<void>;
  milestone: Milestone | null;
}

const RejectMilestoneDialog: React.FC<RejectMilestoneDialogProps> = ({
  open,
  onClose,
  onReject,
  milestone,
}) => {
  const formik = useFormik({
    initialValues: { comment: '' },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (milestone) {
          await onReject(values.comment);
        }
        onClose();
      } catch (error) {
        console.error('Rejection failed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Reject Milestone</DialogTitle>
        <DialogContent dividers>
          <p>
          Are you sure you want to reject this milestone: "{milestone?.milestones[0]?.name.text}"?
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
          <Button type="submit" color="error">
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

export default RejectMilestoneDialog;
