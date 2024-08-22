import React, { useState, FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, DialogContentText } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (comment: string) => void;
    message: string;
}

const ConfirmationCancelDialog: FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, message }) => {
    const [comment, setComment] = useState('');
    

    const handleConfirm = () => {
        onConfirm(comment);
        setComment('');
    };

    const handleClose = () => {
        setComment('');  // Reset the comment when closing the dialog
        onClose();       // Close the dialog
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
            <DialogContentText>{message}</DialogContentText>
                
                <TextField
                    label="Comment"
                    color='secondary'
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
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

export default ConfirmationCancelDialog;
