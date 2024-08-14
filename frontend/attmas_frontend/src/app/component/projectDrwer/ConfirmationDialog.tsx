import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, message }) => {
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
                <Button onClick={onConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
