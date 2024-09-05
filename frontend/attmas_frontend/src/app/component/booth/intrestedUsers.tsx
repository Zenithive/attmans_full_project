
import React, { useState, useEffect } from 'react';
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
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession } from '@/app/reducers/userReducer';
import { APIS } from '@/app/constants/api.constant';
import axiosInstance from '@/app/services/axios.service';
import { pubsub } from '@/app/services/pubsub.service';

interface InterestedModalProps {
    open: boolean;
    onClose: () => void;
    exhibitionId?: string | null;
    boothId?: string | null;
    interestType: 'InterestedUserForExhibition' | 'InterestedUserForBooth';
}

const InterestedModal: React.FC<InterestedModalProps> = ({ open, onClose, exhibitionId, boothId, interestType }) => {
    const [showSignIn, setShowSignIn] = useState(true); // Default to Sign-In form
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(open); // Local state to control modal visibility

    const user = useAppSelector(selectUserSession);

    useEffect(() => {
        if (open) {
            if (user && user.token) {
                // User is already signed in, submit interest directly
                handleSubmitInterest();
                setModalOpen(false); // Close modal immediately
            } else {
                // User is not signed in, keep modal open
                setModalOpen(true);
            }
        } else {
            setModalOpen(false);
        }
    }, [open, user]);

    const handleSignUpSuccess = () => {
        setShowSignIn(true); // Automatically switch to Sign In after successful sign-up
        setMessage('Sign-up successful. Please sign in.');
    };

    const handleSignInSuccess = () => {
        setMessage('Thank you for signing in. We will update you soon.');
        setTimeout(() => {
            setMessage(null);
            onClose();
        }, 1500);
    };

    const handleSubmitInterest = async () => {
        if (user && user.token) {
            try {
                const interestedUser = {
                    username: user.username,
                    userId: user._id,
                    userType: user.userType,
                    exhibitionId: exhibitionId || null,
                    boothId: boothId || null,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobileNumber: user.mobileNumber,
                    interestType: interestType,
                };

                await axiosInstance.post(APIS.CHECKINTRESTEDUSER, interestedUser, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                setMessage('Thank you for showing interest.');
                pubsub.publish('VisitorUpdated', { message: 'Visitor list updated' });
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                }, 1500);
            } catch (error) {
                setErrorMessage('Failed to submit interest. Please try again.');
            }
        }
    };

    return (
        <Modal open={modalOpen} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
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
                {errorMessage && (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                {showSignIn ? (
                    <SignIn
                        exhibitionId={exhibitionId}
                        boothId={boothId}
                        interestType={interestType}
                        showLinks={false}
                        onSignInSuccess={handleSignInSuccess}
                    />
                ) : (
                    <SignUp
                        showLinks={false}
                        onSignUpSuccess={handleSignUpSuccess}
                        userType="Visitors"
                        isAllProfileCompleted={true}
                        interestType={interestType}
                    />
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
