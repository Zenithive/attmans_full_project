"use client";
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
    Button
} from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import axios from 'axios';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import ProductTable, { Product } from '../ProductTable';

interface FormValues {
    qualification: string;
    organization: string;
    sector: string;
    workAddress: string;
    designation: string;
    userType: string;
    productToMarket: string;
    products: Product[];
    hasPatent: string;
    patentDetails: string;
    username: string;
    userId: string;
}

const EditProfile2: React.FC = () => {
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [label, setLabel] = useState("Provide details about the research product or solution that you intend to commercialize");

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

    const formik = useFormik<FormValues>({
        initialValues: {
            qualification: '',
            organization: '',
            sector: '',
            workAddress: '',
            designation: '',
            userType: '',
            productToMarket: '',
            products: [{
                productName: '', productDescription: '', productPrice: 0, currency: 'INR',
                productQuantity: 0,
                targetaudience: '',
                problemaddressed: '',
                technologyused: '',
                stageofdevelopmentdropdown: '',
                intellectualpropertyconsiderations: '',
                CompetitiveAdvantages: '',
                feasibilityofthesolution: '',
                howdoesthesolutionwork: '',
                potentialbenefits: '',
                challengesorrisks: '',
                id: ''
            }],
            hasPatent: 'No',
            patentDetails: '',
            username: userDetails.username,
            userId: userDetails._id,
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
                const response = await axios.get(`${SERVER_URL}/profile/profileByUsername2?username=${userDetails.username}`);
                const userData = response.data;

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
                    patentDetails: userData.patentDetails || '',

                });

                setIsFreelancer(userData.userType === 'Innovators');
                setShowProductDetails(userData.productToMarket === 'Yes');
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
        setIsFreelancer(value === 'Innovators');

        if (value !== 'Innovators') {
            setShowProductDetails(false);
            formik.setFieldValue('productToMarket', 'No');
        } else {
            if (formik.values.productToMarket === 'Yes') {
                setShowProductDetails(true);
            }
        }
    };

    const handleProductToMarketChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        formik.handleChange(event);
        setShowProductDetails(value === 'Yes');
    };

    const handleProductChange = (index: number, updatedProduct: Product) => {
        const updatedProducts = [...formik.values.products];
        updatedProducts[index] = updatedProduct;
        formik.setFieldValue('products', updatedProducts);
    };

    const handleFocus = () => {
        setLabel("Share Solution");
      };
    
   
      const handleBlur = () => {
        if (!formik.values.patentDetails) {
          setLabel("Provide details about the research product or solution that you intend to commercialize");
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
                    '@media (max-width: 767px)': {
                        width: '105%',
                        position: 'relative',
                        left: '7%'
                    }
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
                        <Grid container spacing={2} sx={{
                            '@media (max-width: 767px)': {
                                width: '126%', position: 'relative', right: '26px'
                            }
                        }}>
                            <Grid color= 'secondary' item xs={12} sm={6}>
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
                                    <MenuItem value="College">College</MenuItem>
                                    <MenuItem value="Graduate">Graduate</MenuItem>
                                    <MenuItem value="Post-Graduate">Post-Graduate</MenuItem>
                                    <MenuItem value="Ph.D.">Ph.D.</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid color= 'secondary' item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="organization"
                                    label="Organization"
                                    color= 'secondary'
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
                                    id="sector"
                                    label="Sector"
                                    color= 'secondary'
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
                                    id="workAddress"
                                    color= 'secondary'
                                    label="Work Address"
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
                                    id="designation"
                                    color= 'secondary'
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
                                        color= 'secondary'
                                        label="Product to Market"
                                        name="productToMarket"
                                        onChange={(e) => {
                                            handleProductToMarketChange(e);
                                            formik.handleChange(e);
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

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="hasPatent"
                                    color= 'secondary'
                                    label="Do you have a patent?"
                                    name="hasPatent"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.hasPatent}
                                    error={formik.touched.hasPatent && Boolean(formik.errors.hasPatent)}
                                    helperText={formik.touched.hasPatent && formik.errors.hasPatent}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>

                            {formik.values.hasPatent === "Yes" && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                id="patentDetails"
                                                color='secondary'
                                                // label="Provide details about the research product or solution that you intend to commercialize"
                                                label={label}
                                                name="patentDetails"
                                                onChange={formik.handleChange}
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);
                                                    handleBlur(); 
                                                  }}
                                                onFocus={handleFocus}
                                                value={formik.values.patentDetails}
                                                error={formik.touched.patentDetails && Boolean(formik.errors.patentDetails)}
                                                helperText={formik.touched.patentDetails && formik.errors.patentDetails}
                                            />
                                        </Grid>
                                    )}
                            {isFreelancer && showProductDetails && (
                                <Grid item xs={12}>
                                    <ProductTable
                                        products={formik.values.products}
                                        onRemove={(index: number) => {
                                            const updatedProducts = [...formik.values.products];
                                            updatedProducts.splice(index, 1);
                                            formik.setFieldValue('products', updatedProducts);
                                        }}
                                        onChange={(index: number, updatedProduct: Product) => handleProductChange(index, updatedProduct)}
                                    />
                                    <Button
                                        onClick={() => {
                                            const updatedProducts = [...formik.values.products, { productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR' }];
                                            formik.setFieldValue('products', updatedProducts);
                                        }}
                                    >
                                        Add Product
                                    </Button>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Box mt={3} display="flex" justifyContent="center">
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                        loadingIndicator={<CircularProgress size={24} />}
                                    >
                                        Update Work Experience
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </FormikProvider>

                {/* Added sentences at the end of the form */}
                <Typography
                    variant="body2"
                    align="center"
                    mt={4}
                    sx={{ color: 'red', fontStyle: 'italic', fontWeight: 'bold' }}
                >
                    Please Note: <br />
                    If you have a granted patent or publish patent application, please give a link in the "Share Solution" section above. <br />
                    Please provide ONLY NON-CONFIDENTIAL information. Do NOT provide ANYTHING that is PROPRIETARY and CONFIDENTIAL.
                </Typography>
                {fetchError && (
                    <Typography color="error" align="center" mt={2}>
                        {fetchError}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default EditProfile2;
