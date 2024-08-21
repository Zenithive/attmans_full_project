import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

interface ConfirmCloseBoxProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, comment: string) => void; // Updated to include id
    id: string; // Add id prop
}

const ConfirmCloseBox: React.FC<ConfirmCloseBoxProps> = ({ open, onClose, onConfirm ,id }) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(id, comment); // Pass id and comment to onConfirm
    setComment(''); // Clear the comment after confirmation
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Close</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to close this project? Please provide a comment.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Comment"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCloseBox;
