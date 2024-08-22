import React, { useState, FC } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

interface ConfirmationDialogWithCommentProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string, comment: string) => void;
  id: string; // Add id prop

}

const ConfirmationDialogWithCommentForCancel: FC<ConfirmationDialogWithCommentProps> = ({ open, onClose, onConfirm,id }) => {
  const [comment, setComment] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(id, comment);
    onClose();
  };

  const handleClose = () => {
    setComment(''); // Reset comment when closing the dialog
    onClose(); // Trigger the onClose prop function
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Are you sure you want to cancel?</DialogTitle>
      <DialogContent>
        <TextField
          label="Add a comment (optional)"
          color='secondary'
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialogWithCommentForCancel;
