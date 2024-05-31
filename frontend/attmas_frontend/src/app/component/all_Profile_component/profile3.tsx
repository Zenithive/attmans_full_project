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
    InputLabel,
    Select,
    FormHelperText
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
                            // borderColor: "rgb(0,23,98)",
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

interface ProfileForm3Props {
    onNext: () => void;
}

// const ProfileForm3 = () => {
const ProfileForm3: React.FC<ProfileForm3Props> = ({ onNext }) => {
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


        // validationSchema: Yup.object({
        //     gender: Yup.string().required('Required'),
        //     address: Yup.string().required('Required'),
        //     city: Yup.string().required('Required'),
        //     state: Yup.string().required('Required'),
        //     pinCode: Yup.string().required('Required'),
        //     country: Yup.string().required('Required'),
        //     linkedIn: Yup.string().url('Invalid URL'),
        //     organization: Yup.string(),
        //     sector: Yup.string(),
        //     workAddress: Yup.string(),
        //     designation: Yup.string(),
        //     billingAddress: Yup.string(),
        //     password: Yup.string().required('Required'),
        //     userType: Yup.string().required('Required'),
        //     productToMarket: Yup.string().when('userType', {
        //         is: 'Freelancer',
        //         then: Yup.string().required('Required'),
        //         otherwise: Yup.string(),
        //     }),
        //     productName: Yup.string().when('productToMarket', {
        //         is: 'Yes',
        //         then: Yup.string().required('Required'),
        //         otherwise: Yup.string(),
        //     }),
        //     productType: Yup.string().when('productToMarket', {
        //         is: 'Yes',
        //         then: Yup.string().required('Required'),
        //         otherwise: Yup.string(),
        //     }),
        //     productPrice: Yup.string().when('productToMarket', {
        //         is: 'Yes',
        //         then: Yup.string().required('Required'),
        //         otherwise: Yup.string(),
        //     }),
        //     productDescription: Yup.string().when('productToMarket', {
        //         is: 'Yes',
        //         then: Yup.string().required('Required'),
        //         otherwise: Yup.string(),
        //     }),
        // }),
        onSubmit: async (values) => {
            console.log('Form values:', values);
            onNext(); // Call onNext when the form is submitted

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
                        // backgroundColor: 'rgb(245,245,245)',
                        width: '142.5%', // Increase the width of the box
                        position: 'relative',
                        right: '180px',
                        bottom: "60px",
                        boxShadow: 5,
                    }}
                >



                    <Typography component="h1" variant="h5" align="center">
                        Category
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        View and Change your category here
                    </Typography>



                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        

                        <Grid container spacing={2}>


                          

                            

                            

                            

                            

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
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="userType"
                                    label="User Type"
                                    name="userType"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                >
                                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                                    <MenuItem value="Business">Business</MenuItem>
                                </TextField>
                                {formik.touched.userType && formik.errors.userType && (
                                    <FormHelperText error>{formik.errors.userType}</FormHelperText>
                                )}
                            </Grid>



                           

                            {formik.values.userType === 'Freelancer' && (
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Do you have a product to market?</InputLabel>
                                    <Select
                                        fullWidth
                                        style={{ background: "white", borderRadius: "25px" }}
                                        id="productToMarket"
                                        name="productToMarket"
                                        value={formik.values.productToMarket}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowProductDetails(e.target.value === 'Yes');
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.productToMarket && Boolean(formik.errors.productToMarket)}
                                    >
                                        {/* <MenuItem value="">Select</MenuItem> */}
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                    {formik.touched.productToMarket && formik.errors.productToMarket && (
                                        <FormHelperText error>{formik.errors.productToMarket}</FormHelperText>
                                    )}
                                </Grid>
                            )}

                            {showProductDetails && (
                                <>
                                    <Grid item xs={12} sm={6} >
                                        <TextField
                                            fullWidth
                                            style={{ background: "white", borderRadius: "25px" }}
                                            id="productName"
                                            label="Product Name"
                                            name="productName"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productName}
                                            error={formik.touched.productName && Boolean(formik.errors.productName)}
                                            helperText={formik.touched.productName && formik.errors.productName}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            style={{ background: "white", borderRadius: "25px" }}
                                            id="productType"
                                            label="Product Type"
                                            name="productType"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productType}
                                            error={formik.touched.productType && Boolean(formik.errors.productType)}
                                            helperText={formik.touched.productType && formik.errors.productType}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            style={{ background: "white", borderRadius: "25px" }}
                                            id="productDescription"
                                            label="Product Description"
                                            name="productDescription"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productDescription}
                                            error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                                            helperText={formik.touched.productDescription && formik.errors.productDescription}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            style={{ background: "white", borderRadius: "25px" }}
                                            id="productPrice"
                                            label="Product Price"
                                            name="productPrice"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productPrice}
                                            error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                                            helperText={formik.touched.productPrice && formik.errors.productPrice}
                                        />
                                    </Grid>
                                </>
                            )}


                            
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{ mt: 2, mb: 2, px: 3, py: 1, marginLeft:"0.1%", top:'65px' }} // Adjust padding as needed
                            
                        >
                            Back
                        </Button>

                       

                        <Button
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{ mt: 2, mb: 2, px: 3, py: 1, 
                                marginLeft:'93%' 
                            }} // Adjust padding as needed
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );

};

export default ProfileForm3;