import React, { useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    IconButton,
    Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SignIn } from '../Signin/signin';
import { SignUp } from '../SignUp/signup';

interface InterestedModalProps {
    open: boolean;
    onClose: () => void;
    exhibitionId?: string | null;
}


const InterestedModal: React.FC<InterestedModalProps> = ({ open, onClose, exhibitionId }) => {
    const [showSignIn, setShowSignIn] = useState(true); // Default to Sign-In form
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSignUpSuccess = () => {
        setShowSignIn(true); // Automatically switch to Sign In after successful sign-up
        setMessage('Sign-up successful. Please sign in.');
    };

    const handleSignInSuccess = () => {
        setMessage('Thank you for signing in. We will update you soon.');
        // Close the modal after a short delay to show the success message
        setTimeout(() => {
            setMessage(null);
            onClose();
        }, 1500);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: 'white',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '20px',
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {message && (
                    <Alert severity="success" sx={{ my: 2 }}>
                        {message}
                    </Alert>
                )}
                {showSignIn ? (
                    <SignIn exhibitionId={exhibitionId} showLinks={false} onSignInSuccess={handleSignInSuccess} />
                ) : (
                    <SignUp showLinks={false} onSignUpSuccess={handleSignUpSuccess} userType="Visitors" isAllProfileCompleted={true} />
                )}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 80,
                        right: 30,
                    }}
                >
                    {showSignIn ? (
                        <Typography
                            variant="body2"
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setShowSignIn(false)}
                        >
                            Don't have an account? Sign Up
                        </Typography>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setShowSignIn(true)}
                        >
                            Already have an account? Sign In
                        </Typography>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default InterestedModal;
