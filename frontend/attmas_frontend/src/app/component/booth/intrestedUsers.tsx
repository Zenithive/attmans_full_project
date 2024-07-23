import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    IconButton,
    CircularProgress,
    Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';

interface InterestedModalProps {
    open: boolean;
    onClose: () => void;
    exhibitionId: string | null;
}

interface SignUpFormValues {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    username: string;
    exhibitionId: string;
    password: string;
}

interface SignInFormValues {
    username: string;
    password: string;
}

const InterestedModal: React.FC<InterestedModalProps> = ({ open, onClose, exhibitionId }) => {
    const [showSignIn, setShowSignIn] = useState(true); // Default to Sign-In form

    const signUpInitialValues: SignUpFormValues = {
        firstName: '',
        lastName: '',
        mobileNumber: '',
        username: '',
        exhibitionId: exhibitionId || '',
        password: '',
    };

    const signInInitialValues: SignInFormValues = {
        username: '',
        password: '',
    };

    const signUpValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().email('Invalid email address').required('Email is required'),
        mobileNumber: Yup.string().required('Contact Number is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    });

    const signInValidationSchema = Yup.object().shape({
        username: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    });

    const handleSignUpSubmit = async (values: SignUpFormValues, { resetForm }: FormikHelpers<SignUpFormValues>) => {
        try {
            await axios.post(APIS.SIGNUP, {
                ...values,
                userType: 'visitors', // Always include this value
                isAllProfileCompleted: true, // Always include this value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful response
            setShowSignIn(true); // Automatically switch to Sign In after successful sign-up
        } catch (error) {
            console.error('Error submitting sign-up form:', error);
        } finally {
            resetForm();
        }
    };

    const handleSignInSubmit = async (values: SignInFormValues, { resetForm }: FormikHelpers<SignInFormValues>) => {
        try {
            await axios.post(APIS.LOGIN, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful response
        } catch (error) {
            console.error('Error signing in:', error);
        } finally {
            resetForm();
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 600,
                    bgcolor: 'white',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'auto',
                    maxHeight: '90vh',
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
                <Typography id="modal-title" variant="h6" component="h2">
                    {showSignIn ? 'Sign In' : 'Sign Up'}
                </Typography>
                {!showSignIn ? (
                    <Formik initialValues={signUpInitialValues} validationSchema={signUpValidationSchema} onSubmit={handleSignUpSubmit}>
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            color="secondary"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.firstName && errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            color="secondary"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.lastName && errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="username"
                                            color="secondary"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.username && errors.username)}
                                            helperText={touched.username && errors.username}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contact Number"
                                            name="mobileNumber"
                                            color="secondary"
                                            value={values.mobileNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                                            helperText={touched.mobileNumber && errors.mobileNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            color="secondary"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                </Grid>

                                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }} disabled={isSubmitting}>
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                </Button>
                                <Button variant="text" onClick={() => setShowSignIn(true)} style={{ marginTop: '20px' }}>
                                    Already have an account? Sign In
                                </Button>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Formik initialValues={signInInitialValues} validationSchema={signInValidationSchema} onSubmit={handleSignInSubmit}>
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="username"
                                            color="secondary"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.username && errors.username)}
                                            helperText={touched.username && errors.username}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            color="secondary"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                </Grid>

                                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }} disabled={isSubmitting}>
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>
                                <Button variant="text" onClick={() => setShowSignIn(false)} style={{ marginTop: '20px' }}>
                                    Don't have an account? Sign Up
                                </Button>
                            </form>
                        )}
                    </Formik>
                )}
            </Box>
        </Modal>
    );
};

export default InterestedModal;
