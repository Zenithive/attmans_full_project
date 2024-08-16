import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (comment: string) => void; // Modify to receive a comment
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, message }) => {
    const [comment, setComment] = useState('');

    const handleConfirm = () => {
        onConfirm(comment); // Pass the comment to the onConfirm function
        setComment(''); // Reset comment input after confirmation
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    color='secondary'
                    id="comment"
                    label="Add a comment (optional)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} // Update comment state
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        backgroundColor: '#757575',
                        '&:hover': {
                            backgroundColor: '#757575', // Darken the grey on hover
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
