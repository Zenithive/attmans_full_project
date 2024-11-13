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
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { addUser, selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import ProductTable, { Product } from '../ProductTable';
import { userType } from '@/app/services/user.access.service';
import AddProductModal2 from '../all_Profile_component/AddProductModal2';
import NewProductTable from '../all_Profile_component/NewProductTable';
import axiosInstance from '@/app/services/axios.service';
import { translationsforPROFILE2 } from '../../../../public/trancation';

interface FormValues {
    qualification: string;
    organization: string;
    sector: string;
    Headline: string;
    workAddress: string;
    designation: string;
    userType: string;
    productToMarket: string;
    products: Product[];
    hasPatent: string;
    patentDetails: string; // New field
    username: string;
    userId: string;
}



const EditProfile2: React.FC = () => {

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const language = userDetails.language || 'english';


  const t = translationsforPROFILE2[language as keyof typeof translationsforPROFILE2] || translationsforPROFILE2.english;


    const [isFreelancer, setIsFreelancer] = useState(userDetails.userType === 'Freelancer' || false);

    const [isInnovator, setIsInnovator] = useState(userDetails.userType === 'Innovator' || false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [label, setLabel] = useState("Provide details about the research product or solution that you intend to commercialize");
    const [labels, setLabels] = useState("Enter a brief sentences that best summarizes your core expertise and skills, like you would on your resume of LinkedIn profile.");


    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);


    const dispatch = useAppDispatch();

    const validationSchema = Yup.object({
        Headline: Yup.string().required('Headline is required'),
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
                productQuantity: Yup.number().nullable(),
                videourlForproduct: Yup.string().nullable(),
                technologyused: Yup.string().nullable(),
                targetaudience: Yup.string().nullable(),
                problemaddressed: Yup.string().nullable(),
                productPrice: Yup.number().nullable(),
                intellectualpropertyconsiderations: Yup.string().nullable(),
                CompetitiveAdvantages: Yup.string().nullable(),
                feasibilityofthesolution: Yup.string().nullable(),
                stageofdevelopmentdropdown: Yup.string().nullable(),
                howdoesthesolutionwork: Yup.string().nullable(),
                challengesorrisks: Yup.string().nullable(),
                potentialbenefits: Yup.string().nullable(),
                currency: Yup.string().oneOf(['INR', 'USD']).required('Currency is required'),
            })
        ),
        hasPatent: Yup.string().nullable(),

    });


    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/profile/profileByUsername2?username=${userDetails.username}`);
                const userData = response.data;

                formik.setValues({
                    ...formik.values,
                    Headline: userData.Headline || '',
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

                setIsFreelancer(userData.userType === 'Innovator');
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



    const handleFocus = () => {
        setLabel("Share Solution");
        setLabels("HeadLine");
    };


    const handleBlur = () => {
        if (!formik.values.patentDetails) {
            setLabel("Provide details about the research product or solution that you intend to commercialize");
        }
        if (!formik.values.Headline) {
            setLabels("Enter a brief sentences that best summarizes your core expertise and skills, like you would on your resume of LinkedIn profile.");
        }
    };



    const handleUserTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        formik.handleChange(event);
        setIsInnovator(value === 'Innovator');
        
        if (value !== 'Innovator') {
            setShowProductDetails(false);
            formik.setFieldValue('productToMarket', 'No');
            formik.setFieldValue('hasPatent', 'No');
            formik.setFieldValue('patentDetails', '');
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

    // const handleAddProduct = () => {
    //     setShowAddProductModal(true); // Open the modal
    //     setOpenModal(true)
    // };

    const handleAddProduct = () => {
        setEditingProduct(null); // Clear any existing product being edited
        setViewOnly(false); // Ensure it's in edit mode
        setShowAddProductModal(true);
    };

    // const handleSaveProduct = (newProduct: Product) => {
    //     console.log('New Product:', newProduct);
    //     setProducts((prevProducts) => [...prevProducts, newProduct]);
    //     formik.setFieldValue('products', [...formik.values.products, newProduct]);
    // };

    const handleSaveProduct = (newProduct: Product) => {
        console.log('Product to Save:', newProduct);

        // Check if a product is provided for editing
        if (editingProduct) {
            // Update existing product
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.id === editingProduct.id ? { ...p, ...newProduct } : p
                )
            );
            formik.setFieldValue(
                'products',
                formik.values.products.map((p: Product) =>
                    p.id === editingProduct.id ? { ...p, ...newProduct } : p
                )
            );
        } else {
            // Add new product
            setProducts((prevProducts) => [...prevProducts, newProduct]);
            formik.setFieldValue('products', [...formik.values.products, newProduct]);
        }

        // Close modal and reset form
        setShowAddProductModal(false);
    };


    // const handleViewProduct = (product: Product) => {
    //     // Set the product to be viewed
    //     setEditingProduct(product);
    //     // Open the modal
    //     setShowAddProductModal(true);
    //     console.log("Viewing Product", product);
    // };

    const handleViewProduct = (product: Product) => {
        setEditingProduct(product);
        setViewOnly(true);
        setShowAddProductModal(true);
    };


    // const handleEditProduct = (product: Product) => {

    //     setEditingProduct(product);
    //     // Implement edit product logic here
    //     setShowAddProductModal(true);
    //     console.log("Product", product);
    // };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setViewOnly(false);
        setShowAddProductModal(true);
    };

    const handleDeleteProduct = (id: string) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        formik.setFieldValue('products', updatedProducts);
    };


    const handleProductChange = (index: number, updatedProduct: Product) => {
        const updatedProducts = [...formik.values.products];
        updatedProducts[index] = updatedProduct;
        formik.setFieldValue('products', updatedProducts);
    };

    const formik = useFormik<FormValues>({
        initialValues: {
            Headline: '',
            qualification: '',
            organization: '',
            sector: '',
            workAddress: '',
            designation: '',
            userType: '',
            productToMarket: '',
            products: [],
            hasPatent: 'No',
            patentDetails: '',
            username: userDetails.username,
            userId: userDetails._id,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log("Submitting products:", values.products);
            try {
                const response = await axiosInstance.post(APIS.FORM2, values); // Adjust endpoint as per your backend API
                console.log('Form submitted successfully:', response.data);

                setLoading(false);
                const user1 = {
                    token: userDetails.token,
                    username: userDetails.username,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    mobileNumber: userDetails.mobileNumber,
                    _id: userDetails._id,
                    userType: values.userType as userType
                };

                dispatch(addUser(user1));

                pubsub.publish('toast', {
                    message: 'Profile updated successfully!',
                    severity: 'success',
                });
                // onNext();
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
                    {/* Work Experience */}
                    {t.workExperience}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                    {/* View and change your work experience here */}
                    {t.workExperienceDescription}
                </Typography>

                <FormikProvider value={formik}>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2} sx={{
                            '@media (max-width: 767px)': {
                                width: '126%', position: 'relative', right: '26px'
                            }
                        }}>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    id="Headline"
                                    label={labels}
                                    color='secondary'
                                    name="Headline"
                                    onChange={formik.handleChange}
                                    onBlur={(e) => {
                                        formik.handleBlur(e);
                                        handleBlur();
                                    }}
                                    onFocus={handleFocus}
                                    value={formik.values.Headline}
                                    error={formik.touched.Headline && Boolean(formik.errors.Headline)}
                                    helperText={formik.touched.Headline && formik.errors.Headline}
                                />
                            </Grid>
                            <Grid color='secondary' item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="qualification"
                                    label={t.qualification}
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
                            <Grid color='secondary' item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="organization"
                                    label={t.organization}
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
                                    id="sector"
                                    label={t.sector}
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
                                    id="workAddress"
                                    color='secondary'
                                    label={t.workAddress}
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
                                    color='secondary'
                                    label={t.designation}
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
                                    label={t.userType}
                                    color='secondary'
                                    name="userType"
                                    onChange={(e) => {
                                        handleUserTypeChange(e);
                                        formik.handleChange(e);
                                        formik.setFieldValue('hasPatent', 'No');
                                        formik.setFieldValue('patentDetails', '');
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userType}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                >
                                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                                    <MenuItem value="Project Owner">Project Owner</MenuItem>
                                    <MenuItem value="Innovator">Innovator</MenuItem>
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
                                            color='secondary'
                                            label={t.productToMarket}
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
                                </>
                            ) : ""}

                            {(formik.values.productToMarket == "Yes" || formik.values.userType === 'Freelancer') ? <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    style={{ background: "white", borderRadius: "25px" }}
                                    id="hasPatent"
                                    color='secondary'
                                    label={t.hasPatent}
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

                            {formik.values.hasPatent === 'Yes' &&
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        color='secondary'
                                        name="patentDetails"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows={4}
                                        label={formik.values.userType === 'Freelancer' ? "Provide details about the research product or solution that you intend to commercialize" : "Patent Details"}
                                        value={formik.values.patentDetails}
                                        variant="outlined"
                                    />
                                </Grid>
                            }

                            {isInnovator && showProductDetails && (
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={handleAddProduct}>
                                        Add Product
                                    </Button>

                                </Grid>


                            )}

                            <AddProductModal2

                                open={showAddProductModal}
                                onClose={() => { setShowAddProductModal(false); setEditingProduct(null) }}
                                onSave={handleSaveProduct}
                                product={editingProduct}
                                viewOnly={viewOnly} // Pass the viewOnly flag

                            />


                            {isInnovator && showProductDetails && (

                                <NewProductTable
                                    products={formik.values.products}
                                    onView={handleViewProduct}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                />

                            )}



                            {/* *********** back and back *************** */}

                            <Grid item xs={12}>
                                <Box mt={3} display="flex" justifyContent="center">
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                        loadingIndicator={<CircularProgress size={24} />}
                                    >
                                        {/* {Update Work Experience} */}
                                        {t.updateworkex}
                                    </LoadingButton>
                                </Box>
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

export default EditProfile2;

