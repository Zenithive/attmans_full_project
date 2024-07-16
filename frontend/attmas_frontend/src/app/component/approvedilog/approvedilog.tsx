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

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  booth: Booth | null;
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({ open, onClose, onApprove, booth }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Approve Booth</DialogTitle>
      <DialogContent dividers>
        <p>Are you sure you want to approve this booth "{booth?.title}"?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onApprove} color="primary" autoFocus>
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveDialog;
