"use client"
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    TextField,
    Typography,
    FormHelperText,
    CircularProgress,
    FormControlLabel,
    InputAdornment,
    Select,
    RadioGroup,
    FormControl,
    FormLabel,
    Radio
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import axios from 'axios'; // Import Axios or your preferred HTTP client
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';



const EditProfile2: React.FC = () => {
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const validationSchema = Yup.object({
        qualification: Yup.string().required('Qualification is required'),
        organization: Yup.string().nullable(),
        sector: Yup.string().nullable(),
        workAddress: Yup.string().nullable(),
        designation: Yup.string().nullable(),
        userType: Yup.string().required('Required'),
        productToMarket: Yup.string().nullable(),
        productName: Yup.string().nullable(),
        productDescription: Yup.string().nullable(),
        productType: Yup.string().nullable(),
        productPrice: Yup.string().nullable(),
        hasPatent: Yup.string().nullable(),
        currency: Yup.string().oneOf(['INR', 'USD']).required('Currency is required'),
    });

    const formik = useFormik({
        initialValues: {
            qualification: '',
            organization: '',
            sector: '',
            workAddress: '',
            designation: '',
            userType: '',
            productToMarket: '',
            productName: '',
            productDescription: '',
            productType: '',
            productPrice: '',
            hasPatent: false,
            username: userDetails.username,
            currency: 'INR',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(APIS.FORM2, values); // Adjust endpoint as per your backend API
                console.log('Form submitted successfully:', response.data);
                setLoading(false);
                pubsub.publish('toast', {
                    message: 'Profile updated successfully!',
                    severity: 'success',
                });
            } catch (error) {
                console.error('Error submitting form:', error);
                setLoading(false);
                pubsub.publish('toast', {
                    message: 'Failed to update profile. Please try again later.',
                    severity: 'error',
                });
            }
        },
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${SERVER_URL}/profile/profileByUsername2?username=${userDetails.username}`); // Adjust endpoint as per your backend API
                const userData = response.data; // Assuming your API returns user profile data

                // Update formik values with fetched data
                formik.setValues({
                    ...formik.values,
                    qualification: userData.qualification || '',
                    organization: userData.organization || '',
                    sector: userData.sector || '',
                    workAddress: userData.workAddress || '',
                    designation: userData.designation || '',
                    userType: userData.userType || '',
                    productToMarket: userData.productToMarket || '',
                    productName: userData.productName || '',
                    productDescription: userData.productDescription || '',
                    productType: userData.productType || '',
                    productPrice: userData.productPrice || '',
                    hasPatent: userData.hasPatent || false,
                    currency: userData.currency || 'INR',
                });

                // Update state based on user type for conditional rendering
                if (userData.userType === 'Freelancer') {
                    setIsFreelancer(true);
                    if (userData.productToMarket === 'Yes') {
                        setShowProductDetails(true);
                    } else {
                        setShowProductDetails(false);
                    }
                } else {
                    setIsFreelancer(false);
                    setShowProductDetails(false);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setFetchError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userDetails.username]);

    const handleUserTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        formik.handleChange(event);
        if (value === 'Freelancer') {
            setIsFreelancer(true);
        } else {
            setIsFreelancer(false);
            setShowProductDetails(false);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    padding: 4,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    width: '142.5%',
                    position: 'relative',
                    right: '180px',
                    bottom: "60px",
                    boxShadow: 5,
                }}
            >
                <Typography component="h1" variant="h5" align="center">
                    Work Experience
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                    View and change your work experience here
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                style={{ background: "white", borderRadius: "25px" }}
                                id="qualification"
                                label="Qualification"
                                color='secondary'
                                name="qualification"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.qualification}
                                error={formik.touched.qualification && Boolean(formik.errors.qualification)}
                                helperText={formik.touched.qualification && formik.errors.qualification}
                            >
                                <MenuItem value="School">School</MenuItem>
                                <MenuItem value="Senior Secondary">Senior Secondary</MenuItem>
                                <MenuItem value="Bachelors">Bachelors</MenuItem>
                                <MenuItem value="Masters">Masters</MenuItem>
                                <MenuItem value="PhD">PhD</MenuItem>
                                <MenuItem value="PostDoc">PostDoc</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                style={{ background: "white", borderRadius: "25px" }}
                                id="organization"
                                label="Name of the organization (If any)"
                                color='secondary'
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
                                color='secondary'
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
                                color='secondary'
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
                                multiline
                                rows={3}
                                style={{ background: "white", borderRadius: "25px" }}
                                id="workAddress"
                                label="Work Address (If any)"
                                color='secondary'
                                name="workAddress"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.workAddress}
                                error={formik.touched.workAddress && Boolean(formik.errors.workAddress)}
                                helperText={formik.touched.workAddress && formik.errors.workAddress}
                                InputProps={{
                                    style: {
                                        borderRadius: '25px',
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        padding: '10px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                style={{ background: "white", borderRadius: "25px" }}
                                id="userType"
                                label="User Type"
                                color='secondary'
                                name="userType"
                                value={formik.values.userType}
                                onChange={handleUserTypeChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.userType && Boolean(formik.errors.userType)}
                            >
                                <MenuItem value="Freelancer">Freelancer</MenuItem>
                                <MenuItem value="Project Owner">Project Owner</MenuItem>
                                <MenuItem value="Innovators">Innovators</MenuItem>
                            </TextField>
                            {formik.touched.userType && formik.errors.userType && (
                                <FormHelperText error>{formik.errors.userType}</FormHelperText>
                            )}
                        </Grid>



                        {isFreelancer && (
                            <Grid item xs={12} sm={6}>
                                <FormControl component="fieldset">
                                    <FormLabel color='secondary' component="legend">Do you have a patent?</FormLabel>
                                    <RadioGroup
                                        aria-label="hasPatent"
                                        name="hasPatent"
                                        value={formik.values.hasPatent}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="Yes" control={<Radio color='secondary' />} label="I have a patent" />
                                        <FormControlLabel value="No" control={<Radio color='secondary' />} label="I don't have a patent" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        )}

                        {isFreelancer && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="productToMarket"
                                    label="Do you have a product to market?"
                                    color='secondary'
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
                                        color='secondary'
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
                                        color='secondary'
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
                                        color='secondary'
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
                                        color='secondary'
                                        name="productPrice"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.productPrice}
                                        error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                                        helperText={formik.touched.productPrice && formik.errors.productPrice}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Select
                                                        value={formik.values.currency}
                                                        onChange={formik.handleChange}
                                                        name="currency"
                                                        id="currency"
                                                        sx={{
                                                            background: 'white',
                                                            border: 'none',
                                                            borderRadius: '25px 0 0 25px', // Rounded corners on the left side
                                                            height: '56px', // Match the height of TextField
                                                            paddingRight: '10px',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                border: 'none'
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="INR">₹</MenuItem>
                                                        <MenuItem value="USD">$</MenuItem>
                                                    </Select>
                                                </InputAdornment>
                                            ),
                                            style: {
                                                borderRadius: '25px',
                                                paddingLeft: 0 // Ensure no extra padding on the left side
                                            }
                                        }}
                                    />
                                </Grid>

                            </>
                        )}
                    </Grid>



                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size="small"
                        loading={loading}
                        loadingIndicator={<CircularProgress size={24} />}
                        sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }}
                    >
                        Save
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};

export default EditProfile2;
