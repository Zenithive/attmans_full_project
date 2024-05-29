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
    createTheme,
    ThemeProvider,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const theme = createTheme({
    palette: {
        primary: {
            main: "rgb(0,23,98)",
        },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderRadius: 20,
                            borderColor: "rgb(0,23,98)",
                        },
                        '&:hover fieldset': {
                            borderColor: "rgb(0,23,98)",
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: "rgb(0,23,98)",
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    textTransform: 'none',
                    backgroundColor: "rgb(0,23,98)",
                    '&:hover': {
                        backgroundColor: "rgb(0,23,98)",
                    },
                },
            },
        },
    },
});

const ProfileForm = () => {
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false); // New state

    const formik = useFormik({
        initialValues: {
            gender: '',
            address: '',
            city: '',
            state: '',
            pinCode: '',
            country: '',
            linkedIn: '',
            organization: '',
            sector: '',
            workAddress: '',
            designation: '',
            billingAddress: '',
            password: '',
            userType: '',
            productToMarket: '', // New field
            productName: '', // New field
            productDescription: '', // New field
            productType: '', // New field
            productPrice: '', // New field
        },
        validationSchema: Yup.object({
            gender: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            pinCode: Yup.string().required('Required'),
            country: Yup.string().required('Required'),
            linkedIn: Yup.string().url('Invalid URL'),
            organization: Yup.string(),
            sector: Yup.string(),
            workAddress: Yup.string(),
            designation: Yup.string(),
            billingAddress: Yup.string(),
            password: Yup.string().required('Required'),
            userType: Yup.string().required('Required'),
            productToMarket: Yup.string().when('userType', {
                is: 'Freelancer',
                then: Yup.string().required('Required'),
                otherwise: Yup.string(),
            }),
        }),
        onSubmit: async (values) => {
            console.log('Form values:', values);
        },
    });

    const handleUserTypeChange = (event: { target: { value: string; }; }) => {
        formik.handleChange(event);
        if (event.target.value === 'Freelancer') {
            setIsFreelancer(true);
        } else {
            setIsFreelancer(false);
            setShowProductDetails(false); // Reset product details when changing userType
        }
    };

    const handleProductToMarketChange = (event: { target: { value: string; }; }) => {
        formik.handleChange(event);
        setShowProductDetails(event.target.value === 'Yes');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        padding: 4,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        backgroundColor: 'rgb(245,245,245)',
                        width: '142.5%', // Increase the width of the box
                        position: 'relative',
                        right: '180px',
                        bottom: "60px",
                        boxShadow: 5,
                    }}
                >
                    <Typography component="h1" variant="h5" align="center">
                        Profile Form
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        View and Change your profile information here
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
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="address"
                                    label="Address"
                                    name="address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
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
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="organization"
                                    label="Name of the organization (If any)"
                                    name="organization"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.organization}
                                    error={formik.touched.organization && Boolean(formik.errors.organization)}
                                    helperText={formik.touched.organization && formik.errors.organization}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="sector"
                                    label="Sector (If any)"
                                    name="sector"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.sector}
                                    error={formik.touched.sector && Boolean(formik.errors.sector)}
                                    helperText={formik.touched.sector && formik.errors.sector}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="designation"
                                    label="Designation"
                                    name="designation"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.designation}
                                    error={formik.touched.designation && Boolean(formik.errors.designation)}
                                    helperText={formik.touched.designation && formik.errors.designation}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    select
                                    id="userType"
                                    label="User Type"
                                    name="userType"
                                    onChange={handleUserTypeChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userType}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                >
                                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                                    <MenuItem value="Industry">Industry</MenuItem>
                                    <MenuItem value="Innovators">Innovators</MenuItem>
                                </TextField>
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

                            {isFreelancer && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        style={{ background: "white", borderRadius: "25px" }}
                                        id="productToMarket"
                                        label="Do you have any Product to market?"
                                        name="productToMarket"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.productToMarket}
                                        error={formik.touched.productToMarket && Boolean(formik.errors.productToMarket)}
                                        helperText={formik.touched.productToMarket && formik.errors.productToMarket}
                                    >
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </TextField>
                                </Grid>
                            )}

                            {isFreelancer && (
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: 2,
                                            padding: 2,
                                            marginTop: 2,
                                            backgroundColor: 'rgba(0, 23, 98, 0.1)', // Change as needed
                                        }}
                                    >
                                        <Typography variant="h6">Product Details</Typography>
                                        <TextField
                                            fullWidth
                                            style={{ background: 'white', borderRadius: '25px' }}
                                            id="productName"
                                            label="Product Name"
                                            name="productName"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productName}
                                            error={formik.touched.productName && Boolean(formik.errors.productName)}
                                            helperText={formik.touched.productName && formik.errors.productName}
                                        />

                                        <TextField 
                                            fullWidth
                                            style={{ background: 'white', borderRadius: '25px' }}
                                            id="productPrice"
                                            label="Product Price"
                                            name="productPrice"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productPrice}
                                            error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                                            helperText={formik.touched.productPrice && formik.errors.productPrice}
                                        />


                                        <TextField
                                            fullWidth
                                            style={{ background: 'white', borderRadius: '25px' }}
                                            id="productDescription"
                                            label="Product Description"
                                            name="productDescription"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productDescription}
                                            error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                                            helperText={formik.touched.productDescription && formik.errors.productDescription}
                                        />
                                        <TextField
                                            fullWidth
                                            style={{ background: 'white', borderRadius: '25px' }}
                                            id="productType"
                                            label="Product Type"
                                            name="productType"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productType}
                                            error={formik.touched.productType && Boolean(formik.errors.productType)}
                                            helperText={formik.touched.productType && formik.errors.productType}
                                        />

                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="workAddress"
                                    label="Work Address"
                                    name="workAddress"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.workAddress}
                                    error={formik.touched.workAddress && Boolean(formik.errors.workAddress)}
                                    helperText={formik.touched.workAddress && formik.errors.workAddress}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="billingAddress"
                                    label="Billing Address"
                                    name="billingAddress"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.billingAddress}
                                    error={formik.touched.billingAddress && Boolean(formik.errors.billingAddress)}
                                    helperText={formik.touched.billingAddress && formik.errors.billingAddress}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{ mt: 2, mb: 2, px: 3, py: 1 }} // Adjust padding as needed
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ProfileForm;
