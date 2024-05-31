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
                    marginLeft:"93%",
                    '&:hover': {
                        backgroundColor: "rgb(0,23,98)",
                    },
                },
            },
        },
    },
});

interface ProfileForm2Props {
    onNext: () => void;
}

const ProfileForm2: React.FC<ProfileForm2Props> = ({ onNext }) => {

    const [isFreelancer, setIsFreelancer] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false); // New state

    const formik = useFormik({
        initialValues: {
            organization: '',
            sector: '',
            workAddress: '',
            designation: '',
            userType: '',
            productToMarket: '', // New field
            productName: '', // New field
            productDescription: '', // New field
            productType: '', // New field
            productPrice: '', // New field
        },


        // validationSchema: Yup.object({
        //     organization: Yup.string(),
        //     sector: Yup.string(),
        //     workAddress: Yup.string(),
        //     designation: Yup.string(),
        //     userType: Yup.string().required('Required'),
        //     productToMarket: Yup.string(),
        //     productName: Yup.string(),
        //     productType: Yup.string(),
        //     productPrice: Yup.string(),
        //     productDescription: Yup.string(),

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
                        width: '142.5%', // Increase the width of the box
                        position: 'relative',
                        right: '180px',
                        bottom: "60px",
                        boxShadow: 5,
                    }}
                >

                    <Typography component="h1" variant="h5" align="center">
                        Work Exprience
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        View and Change your work exprience here
                    </Typography>



                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="userType"
                                    label="Qualification"
                                    name="userType"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                >
                                    <MenuItem value="School">School</MenuItem>
                                    <MenuItem value="Senior Secondary">Senior Secondary</MenuItem>
                                    <MenuItem value="Bacherlors">Bacherlors</MenuItem>
                                    <MenuItem value="Masters">Masters</MenuItem>
                                    <MenuItem value="PhD">PhD</MenuItem>
                                    <MenuItem value="PostDoc">PostDoc</MenuItem>
                                </TextField>
                                {formik.touched.userType && formik.errors.userType && (
                                    <FormHelperText error>{formik.errors.userType}</FormHelperText>
                                )}
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


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="workAddress"
                                    label="Work Address (If any)"
                                    name="workAddress"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.workAddress}
                                    error={formik.touched.workAddress && Boolean(formik.errors.workAddress)}
                                    helperText={formik.touched.workAddress && formik.errors.workAddress}
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
                                    <TextField
                                        fullWidth
                                        select
                                        style={{ background: "white", borderRadius: "25px" }}
                                        id="productToMarket"
                                        label="Do you have a product to market?"
                                        name="productToMarket"
                                        value={formik.values.productToMarket}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowProductDetails(e.target.value === 'Yes');
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.productToMarket && Boolean(formik.errors.productToMarket)}
                                    >
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </TextField>
                                    {formik.touched.productToMarket && formik.errors.productToMarket && (
                                        <FormHelperText error>{formik.errors.productToMarket}</FormHelperText>
                                    )}
                                </Grid>
                            )}

                            {showProductDetails && (
                                <>
                                    <Grid item xs={12}>
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

export default ProfileForm2;