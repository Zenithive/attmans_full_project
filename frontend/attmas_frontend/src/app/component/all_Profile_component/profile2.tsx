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
    hasPatent: boolean;
    username: string;
    userId: string;
}

interface ProfileForm2Props {
    onNext: () => void;
    onPrevious: () => void;
}


const ProfileForm2: React.FC<ProfileForm2Props> = ({ onNext, onPrevious }) => {

    const [isInnovator, setIsInnovator] = useState(false);
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

    const formik = useFormik<FormValues>({
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
                console.log('Form submitted successfully:', response.data);

                setLoading(false);
                pubsub.publish('toast', {
                    message: 'Profile updated successfully!',
                    severity: 'success',
                });
                onNext();
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

   

    const handleUserTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        formik.handleChange(event);
        setIsInnovator(value === 'Innovators');

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


                            {isInnovator ? (
                                <>
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

                                    {formik.values.productToMarket == "Yes" ? <Grid item xs={12} sm={6}>
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
                                    </Grid> : ""}
                                </>
                            ) : ""}

                            
                            {isInnovator && showProductDetails && (
                                <>
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
                                        
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={() => {
                                                const updatedProducts = [...formik.values.products, { productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR' }];
                                                formik.setFieldValue('products', updatedProducts);
                                            }}
                                        >
                                            Add Product
                                        </Button>
                                    </Grid>
                                </>
                            )}
                            

                            {/* *********** back and back *************** */}

                            <Grid item xs={12}>
                                <Button
                                type="button"
                                variant="contained"
                                size="small"
                                sx={{ mt: 2, mb: 2, px: 3, py: 1, marginLeft: "0.1%", top: '65px' , '@media (max-width: 767px)':{
                                    position:'relative',
                                    top:'2px'
                                }}}
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
                                    sx={{ 
                                        mt: 2,
                                        mb: 2,
                                        ml: { xs: 'auto', md: '90%' }, 
                                        width: { xs: '40%', md: '10%' }, 
                                        height: '40px',
                                        position: { xs: 'relative', md: 'static' }, 
                                        left:'40%'
                                    }}
                                >
                                    Save & Next
                                </LoadingButton>
                            </Grid>

                        </Grid>
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
