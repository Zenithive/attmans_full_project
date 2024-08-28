import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (status: 'Approved' | 'Rejected', comment: string) => void;
    action: 'Approve' | 'Reject';
}

const ProposalConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, action }) => {
    const [comment, setComment] = useState('');

    const handleConfirm = () => {
        onConfirm(action === 'Approve' ? 'Approved' : 'Rejected', comment);
        setComment('');
        onClose();
    };

    const handleClose = () => {
        setComment(''); // Reset comment when closing the dialog
        onClose(); // Trigger the onClose prop function
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{action} Proposal</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to {action.toLowerCase()} this proposal?
                </Typography>
                <TextField
                color='secondary'
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProposalConfirmationDialog;
