import React from 'react';
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
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';

interface BoothDetailsModalProps {
    open: boolean;
    onClose: () => void;
    exhibitionId: string | null;
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    userId: string;
    username: string;
    exhibitionId: string;
}

const InterestedModal: React.FC<BoothDetailsModalProps> = ({ open, onClose, exhibitionId }) => {
    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const initialValues: FormValues = {
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        userId: userDetails._id,
        username: '',
        exhibitionId: exhibitionId || '',
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().email('Invalid email address').required('Email is required'),
        mobileNumber: Yup.string().required('Contact Number is required'),
    });

    const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        try {
            const response = await axios.post(APIS.CHECKINTRESTEDUSER, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;

            if (result.success) {
                // User exists and email sent; no extra action needed
            } else {
                // User does not exist; no extra action needed
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            // Always close the modal and reset the form
            resetForm();
            onClose();
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
                    Details
                </Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                            </Grid>

                            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }} disabled={isSubmitting}>
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>
                        </form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
};

export default InterestedModal;
