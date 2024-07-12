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
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    InputAdornment,
    Select,
    Button
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useFormik, FormikProvider, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import axios from 'axios';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';

interface ProfileForm2Props {
    onNext: () => void;
    onPrevious: () => void;
}

const ProfileForm2: React.FC<ProfileForm2Props> = ({ onNext, onPrevious }) => {
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
        products: Yup.array().of(
            Yup.object().shape({
                productName: Yup.string().nullable(),
                productDescription: Yup.string().nullable(),
                productType: Yup.string().nullable(),
                productPrice: Yup.string().nullable(),
                currency: Yup.string().oneOf(['INR', 'USD']).required('Currency is required'),
            })
        ),
        hasPatent: Yup.string().nullable(),
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
            products: [{ productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR' }],
            hasPatent: false,
            username: userDetails.username,
            userId: userDetails._id,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(APIS.FORM2, values); // Adjust endpoint as per your backend API
                onNext();
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
                    products: userData.products || [{ productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR' }],
                    hasPatent: userData.hasPatent || false,
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

                <FormikProvider value={formik}>
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
                                    onChange={(e) => {
                                        handleUserTypeChange(e);
                                        formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userType}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                >
                                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                                    <MenuItem value="Project Owner">Project Owner</MenuItem>
                                    <MenuItem value="Innovators">Innovators</MenuItem>
                                </TextField>
                            </Grid>

                            {isFreelancer && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        style={{ background: "white", borderRadius: "25px" }}
                                        id="productToMarket"
                                        label="Do you have any product to market?"
                                        color='secondary'
                                        name="productToMarket"
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            if (e.target.value === 'Yes') {
                                                setShowProductDetails(true);
                                            } else {
                                                setShowProductDetails(false);
                                            }
                                        }}
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

                            {showProductDetails && (
                                <>
                                    <Grid item xs={12}>
                                        <FieldArray
                                            name="products"
                                            render={(arrayHelpers) => (
                                                <div>
                                                    {formik.values.products.map((product, index) => (
                                                        <div key={index}>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        id={`products.${index}.productName`}
                                                                        label="Product Name"
                                                                        name={`products.${index}.productName`}
                                                                        color='secondary'
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={getIn(formik.values, `products.${index}.productName`)}
                                                                        error={getIn(formik.touched, `products.${index}.productName`) && Boolean(getIn(formik.errors, `products.${index}.productName`))}
                                                                        helperText={getIn(formik.touched, `products.${index}.productName`) && getIn(formik.errors, `products.${index}.productName`)}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        id={`products.${index}.productDescription`}
                                                                        label="Product Description"
                                                                        name={`products.${index}.productDescription`}
                                                                        color='secondary'
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={getIn(formik.values, `products.${index}.productDescription`)}
                                                                        error={getIn(formik.touched, `products.${index}.productDescription`) && Boolean(getIn(formik.errors, `products.${index}.productDescription`))}
                                                                        helperText={getIn(formik.touched, `products.${index}.productDescription`) && getIn(formik.errors, `products.${index}.productDescription`)}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        id={`products.${index}.productType`}
                                                                        label="Product Type"
                                                                        name={`products.${index}.productType`}
                                                                        color='secondary'
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={getIn(formik.values, `products.${index}.productType`)}
                                                                        error={getIn(formik.touched, `products.${index}.productType`) && Boolean(getIn(formik.errors, `products.${index}.productType`))}
                                                                        helperText={getIn(formik.touched, `products.${index}.productType`) && getIn(formik.errors, `products.${index}.productType`)}
                                                                    />
                                                                </Grid>

                                                                {/* <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        id={`products.${index}.productPrice`}
                                                                        label="Product Price"
                                                                        name={`products.${index}.productPrice`}
                                                                        color='secondary'
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={getIn(formik.values, `products.${index}.productPrice`)}
                                                                        error={getIn(formik.touched, `products.${index}.productPrice`) && Boolean(getIn(formik.errors, `products.${index}.productPrice`))}
                                                                        helperText={getIn(formik.touched, `products.${index}.productPrice`) && getIn(formik.errors, `products.${index}.productPrice`)}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <Select
                                                                                        id={`products.${index}.currency`}
                                                                                        name={`products.${index}.currency`}
                                                                                        value={getIn(formik.values, `products.${index}.currency`)}
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        error={getIn(formik.touched, `products.${index}.currency`) && Boolean(getIn(formik.errors, `products.${index}.currency`))}
                                                                                        style={{ marginRight: '8px' }}
                                                                                    >
                                                                                        <MenuItem value="INR">INR</MenuItem>
                                                                                        <MenuItem value="USD">USD</MenuItem>
                                                                                    </Select>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                    />
                                                                </Grid> */}

                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        id={`products.${index}.productPrice`}
                                                                        label="Product Price"
                                                                        name={`products.${index}.productPrice`}
                                                                        color="secondary"
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={getIn(formik.values, `products.${index}.productPrice`)}
                                                                        error={getIn(formik.touched, `products.${index}.productPrice`) && Boolean(getIn(formik.errors, `products.${index}.productPrice`))}
                                                                        helperText={getIn(formik.touched, `products.${index}.productPrice`) && getIn(formik.errors, `products.${index}.productPrice`)}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <Select
                                                                                        id={`products.${index}.currency`}
                                                                                        name={`products.${index}.currency`}
                                                                                        value={getIn(formik.values, `products.${index}.currency`)}
                                                                                        onChange={formik.handleChange}
                                                                                        onBlur={formik.handleBlur}
                                                                                        error={getIn(formik.touched, `products.${index}.currency`) && Boolean(getIn(formik.errors, `products.${index}.currency`))}
                                                                                        sx={{
                                                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                                                border: 'none'
                                                                                            },
                                                                                            marginRight: '8px',
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem value="INR">INR</MenuItem>
                                                                                        <MenuItem value="USD">USD</MenuItem>
                                                                                    </Select>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                    />
                                                                </Grid>


                                                                <Grid item xs={12} sm={6}>
                                                                    <IconButton
                                                                        aria-label="remove product"
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                    >
                                                                        <RemoveCircleOutline />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    ))}
                                                    <Box display="flex" justifyContent="center" mt={2}>
                                                        <IconButton
                                                            aria-label="add product"
                                                            onClick={() => arrayHelpers.push({ productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR' })}
                                                        >
                                                            <AddCircleOutline />
                                                        </IconButton>
                                                    </Box>
                                                </div>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl color='secondary' component="fieldset">
                                            <FormLabel color='secondary' component="legend">Do you have a patent?</FormLabel>
                                            <RadioGroup
                                                color='secondary'
                                                aria-label="hasPatent"
                                                name="hasPatent"
                                                value={formik.values.hasPatent ? 'Yes' : 'No'}
                                                onChange={(event) => formik.setFieldValue('hasPatent', event.target.value === 'Yes')}
                                            >
                                                <FormControlLabel color='secondary' value="Yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel color='secondary' value="No" control={<Radio />} label="No" />
                                            </RadioGroup>

                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        

                        <Button
                        type="button"
                        variant="contained"
                        size="small"
                        sx={{ mt: 2, mb: 2, px: 3, py: 1, marginLeft: "0.1%", top: '65px' }}
                        onClick={onPrevious}
                    >
                        Back
                    </Button>

                     <LoadingButton
                        type="submit"
                        variant="contained"
                        size="small"
                        loading={loading}
                        loadingIndicator={<CircularProgress size={24} />}
                        sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }}
                    >
                        Save & Next
                    </LoadingButton>
                    </Box>
                </FormikProvider>

                {fetchError && (
                    <Typography color="error" align="center" mt={2}>
                        {fetchError}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ProfileForm2;
