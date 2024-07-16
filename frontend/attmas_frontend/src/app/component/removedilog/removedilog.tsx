import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
  onRemove: () => void;
  booth: Booth | null;
}

const RemoveDialog: React.FC<RemoveDialogProps> = ({ open, onClose, onRemove, booth }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reject Booth</DialogTitle>
      <DialogContent dividers>
        <p>Are you sure you want to Reject this booth "{booth?.title}"?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onRemove} color="primary" autoFocus>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveDialog;
