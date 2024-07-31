'use client'
import React, { useEffect, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Paper,
    Alert,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SERVER_URL } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';

const EditProfile: React.FC = () => {
    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const [loading, setLoading] = useState(true);
    const [changePassword, setChangePassword] = useState(false);
    const [initialValues, setInitialValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        password: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/users/profile?username=${userDetails.username}`);
                const { firstName, lastName, username, mobileNumber } = response.data;
                setInitialValues({ firstName, lastName, email: username, mobileNumber, password: '' });
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            }
        };

        fetchProfile();
    }, [userDetails.username]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            mobileNumber: Yup.string()
                .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
                .required('Mobile number is required'),
            password: changePassword
                ? Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
                : Yup.string().min(6, 'Password must be at least 6 characters'),
        }),
        onSubmit: async (values, { setStatus }) => {
            try {
                const { password, ...restValues } = values;
                const payload = changePassword ? values : restValues;
                console.log('Payload:', payload);
                await axios.put(`${SERVER_URL}/users/${userDetails._id}`, payload);
                setStatus({ success: 'Profile updated successfully!' });
            } catch (error) {
                setStatus({ error: 'Failed to update profile' });
            }
        },
    });

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container component="main" maxWidth="xs" sx={{marginBottom:'120px'}}>
            <CssBaseline />
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: 5,
                    position:'relative',
                    right:'100%',
                    width:'305%',
                    '@media (max-width: 767px)': {
                        width: '105%',
                        position: 'relative',
                        left: '7%'
                    }
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom sx={{marginBottom:'35px'}}>
                    Edit Profile
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                color="secondary"
                                id="firstName"
                                label="First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                color="secondary"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                color="secondary"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                color="secondary"
                                name="mobileNumber"
                                label="Mobile Number"
                                type="tel"
                                id="mobileNumber"
                                autoComplete="tel"
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={changePassword}
                                         color="secondary"
                                        onChange={(e) => setChangePassword(e.target.checked)}
                                    />
                                }
                                label="Change Password"
                            />
                        </Grid>
                        {changePassword && (
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    color="secondary"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 ,width:'12%',position:'relative',left:'44%',  '@media (max-width: 767px)': {
                            width:'45%',position:'relative',left:'30%'
                        }}}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                    {formik.status?.error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {formik.status.error}
                        </Alert>
                    )}
                    {formik.status?.success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {formik.status.success}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default EditProfile;
