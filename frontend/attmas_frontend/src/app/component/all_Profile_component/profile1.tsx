"use client";
import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';  
import LoadingButton from '@mui/lab/LoadingButton';
import { APIS } from '@/app/constants/api.constant';



interface ProfileForm1Props {
    onNext: () => void;
}

const ProfileForm1: React.FC<ProfileForm1Props> = ({ onNext }) => {
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            gender: '',
            address: '',
            city: '',
            state: '',
            pinCode: '',
            country: '',
            linkedIn: '',
            billingAddress: '',
        },
        validationSchema: Yup.object({
            gender: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            pinCode: Yup.string().required('Required'),
            country: Yup.string().required('Required'),
            linkedIn: Yup.string().url('Invalid URL').required('Required'),
                billingAddress: Yup.string(),
        }),

        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('profilePhoto', profilePhoto as Blob);
                Object.keys(values).forEach(key => {
                    formData.append(key, (values as any)[key]);
                });

                await axios.post(APIS.FORM1, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onNext(); // Call onNext when the form is submitted
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    });

    return (
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        padding: 4,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        width: '142.5%', // Increase the width of the box
                        position: 'relative',
                        right: '180px',
                        bottom: "60px",
                        boxShadow: 5,
                    }}
                >
                    <Typography component="h1" variant="h5" align="center">
                        Personal Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        View and Change your personal details here
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-photo"
                            type="file"
                            onChange={(event) => {
                                if (event.currentTarget.files) {
                                    const file = event.currentTarget.files[0];
                                    setProfilePhoto(file);
                                    setProfilePhotoURL(URL.createObjectURL(file));
                                }
                            }}
                        />
                        <label htmlFor="profile-photo">
                            <IconButton component="span" sx={{ width: 50, height: 50, mb: 2 }}>
                                <Avatar
                                    alt="Profile Photo"
                                    src={profilePhotoURL || '/default-profile.png'}
                                    sx={{ width: 50, height: 50, mb: 2, mx: 'auto' }}
                                />
                                <CameraAltIcon
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        color: 'white',
                                        backgroundColor: 'grey',
                                        borderRadius: '50%',
                                    }}
                                />
                            </IconButton>
                        </label>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6} // Adjust the number of rows as needed
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="address"
                                    label="Address"
                                    name="address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                    InputProps={{
                                        style: {
                                            borderRadius: '25px',
                                        },
                                    }}
                                    inputProps={{
                                        style: {
                                            padding: '10px', // Adjust the padding as needed
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="city"
                                    label="City"
                                    name="city"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.city}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="state"
                                    label="State"
                                    name="state"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.state}
                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                    helperText={formik.touched.state && formik.errors.state}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="pinCode"
                                    label="Pin Code"
                                    name="pinCode"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pinCode}
                                    error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                                    helperText={formik.touched.pinCode && formik.errors.pinCode}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="country"
                                    label="Country"
                                    name="country"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.country}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country && formik.errors.country}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="linkedIn"
                                    label="LinkedIn"
                                    name="linkedIn"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.linkedIn}
                                    error={formik.touched.linkedIn && Boolean(formik.errors.linkedIn)}
                                    helperText={formik.touched.linkedIn && formik.errors.linkedIn}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="gender"
                                    label="Gender"
                                    name="gender"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.gender}
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                                    helperText={formik.touched.gender && formik.errors.gender}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>

                           

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6} // Adjust the number of rows as needed
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="billingAddress"
                                    label="Billing Address"
                                    name="billingAddress"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.billingAddress}
                                    error={formik.touched.billingAddress && Boolean(formik.errors.billingAddress)}
                                    helperText={formik.touched.billingAddress && formik.errors.billingAddress}
                                    InputProps={{
                                        style: {
                                            borderRadius: '25px',
                                        },
                                    }}
                                    inputProps={{
                                        style: {
                                            padding: '10px', // Adjust the padding as needed
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* <Button */}
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }} // Adjust padding as needed
                        >
                            Save & Next
                            {/* </Button> */}
                            </LoadingButton>
                    </Box>
                </Box>
            </Container>
        // </ThemeProvider>
    );
};

export default ProfileForm1;
