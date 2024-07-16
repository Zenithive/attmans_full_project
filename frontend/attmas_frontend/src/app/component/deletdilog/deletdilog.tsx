import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface DeleteConfirmationProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationProps> = ({ open, onCancel, onConfirm, title }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the "{title}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ background: 'grey', "&:hover": { background: 'grey' } }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
