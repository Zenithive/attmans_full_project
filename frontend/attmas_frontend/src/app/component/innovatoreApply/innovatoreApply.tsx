'use client'
import * as React from 'react';
import { Box, IconButton, Divider, Drawer, TextField, Button, CircularProgress, FormControl, Select, MenuItem, InputAdornment, Paper, Typography, Tooltip, Grid, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { pubsub } from '@/app/services/pubsub.service';
import { Formik, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import ProductTable, { Product } from '../ProductTable';
import YouTubeIcon from '@mui/icons-material/YouTube';

interface WorkExprience {
    gender: string
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

interface AddApplyProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    jobTitle: string;
    jobId: string;
    onCancel?: () => void;
}

interface Milestone {
    scopeOfWork: string;
    milestones: string[];
    comments: string[];
}

interface FormValues {
    title: string;
    description: string;
    Budget: number;
    currency: string;
    TimeFrame: Dayjs | null;
    jobId: string;
    applyType: string;
}



const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    Budget: Yup.number().required('Budget is required'),
    currency: Yup.string().required('Currency is required'),
    TimeFrame: Yup.date().nullable('Date & Time is required'),
});

export const AddApplyForInnovatores = ({ open, setOpen, jobTitle, jobId, onCancel }: AddApplyProps) => {
    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const [fetchError, setFetchError] = React.useState<string | null>(null);
    const [workExperience, setWorkExperience] = React.useState<WorkExprience | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [subcategories, setSelectedValues] = React.useState<string[]>([]);
    const [categories, setCategories] = React.useState([]);
    const [products, setProducts] = React.useState<Product[]>([]);


    const initialValues = {
        title: jobTitle,
        description: '',
        Budget: 0,
        currency: 'INR',
        TimeFrame: null as Dayjs | null,
        jobId: jobId,
        applyType: 'InnovatorsApply',
        categories: [],
        subcategories: []
    };


    React.useEffect(() => {
        if (open && userDetails?.username) {
            const fetchWorkExperience = async () => {
                try {
                    const response = await axios.get(`${SERVER_URL}/profile/profileByUsername2?username=${userDetails.username}`);
                    console.log('test@example.you', response.data);
                    setWorkExperience(response.data);
                } catch (error) {
                    console.error('Error fetching Work Experience:', error);
                    setFetchError('Failed to fetch work experience.');
                } finally {
                    setLoading(false);
                }
            };
            fetchWorkExperience();
        }
    }, [open, userDetails?.username]);

    React.useEffect(() => {
        if (userDetails?.username) {
            const fetchUserProfile = async () => {
                try {
                    const response = await axios.get(`${SERVER_URL}/profile/profileByUsername3?username=${userDetails.username}`);
                    const userData = response.data;
                    console.log('userDataMy', userData);
                    setCategories(userData.categories || []);
                    setSelectedValues(userData.subcategories || []);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setFetchError('Failed to fetch user profile');
                }
            };

            fetchUserProfile();
        }
    }, [userDetails?.username]);

    if (loading) {
        return <CircularProgress />;
    }


    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, resetForm }: any
    ) => {
        try {
            const applyData = {
                title: values.title,
                description: values.description,
                TimeFrame: values.TimeFrame ? values.TimeFrame.toISOString() : null,
                currency: values.currency,
                Budget: values.Budget,
                userId: userDetails._id,
                username: userDetails.username,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                jobId: values.jobId,
                applyType: 'InnovatorsApply',
            };

            const applyResponse = await axios.post(APIS.APPLY, applyData);
            const applyId = applyResponse.data._id;


            pubsub.publish('ApplyCreated', { message: 'A new Apply Created' });
            pubsub.publish('toast', { message: 'Applied successfully!', severity: 'success' });

            resetForm();
            setOpen(false);
        } catch (error) {
            console.error('Error creating apply:', error);
            setFetchError('An error occurred while creating the apply.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        setOpen(false);
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const handleProductChange = (index: number, updatedProduct: Product) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? updatedProduct : product
        );
        setProducts(updatedProducts);
    };

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    borderRadius: 3,
                    pr: 10,
                    mr: -8,
                    '@media (max-width: 767px)': { width: '116%' }
                }
            }}
            anchor="right"
            open={open}
            onClose={handleCancel}
        >
            <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
                <h2>Create Apply</h2>
                <IconButton aria-label="close" onClick={handleCancel} sx={{ p: 0, right: 0 }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ my: 5, mt: 0 }} />
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box sx={{ p: 2 }}>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 45%' }}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        color='secondary'
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        disabled
                                        error={!!(errors.title && touched.title)}
                                        helperText={<ErrorMessage name="title" />}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 45%' }}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        color='secondary'
                                        variant="outlined"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        multiline

                                        fullWidth
                                        error={!!(errors.description && touched.description)}
                                        helperText={<ErrorMessage name="description" />}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Box sx={{ flex: '1 1 45%' }}>
                                    <TextField
                                        fullWidth
                                        name="Budget"
                                        label="Budget"
                                        type="number"
                                        color='secondary'
                                        value={values.Budget}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.Budget && Boolean(errors.Budget)}
                                        helperText={touched.Budget && errors.Budget}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FormControl variant="standard">
                                                        <Select
                                                            value={values.currency}
                                                            onChange={(e) => {
                                                                const selectedCurrency = e.target.value as string;
                                                                setFieldValue('currency', selectedCurrency);
                                                            }}
                                                        >
                                                            <MenuItem value="INR">INR</MenuItem>
                                                            <MenuItem value="USD">USD</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 45%',marginBottom:'30px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Time Frame"
                                            value={values.TimeFrame}
                                            slotProps={{
                                                textField: {
                                                    color: 'secondary'
                                                },
                                            }}
                                            onChange={(newValue) => setFieldValue('TimeFrame', newValue)}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                            {/* <Box
                                sx={{
                                    marginTop: 8,
                                    padding: 4,
                                    marginBottom: '50px',
                                    borderRadius: 2,
                                    boxShadow: 5,
                                }}
                            > */}
                            {fetchError && (
                                <Typography color="error" align="center" mt={2}>
                                    {fetchError}
                                </Typography>
                            )}
                            {workExperience && (
                                <Paper elevation={3} sx={{ padding: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Qualification"
                                                value={workExperience.qualification}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Organization"
                                                value={workExperience.organization}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Sector"
                                                value={workExperience.sector}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Work Address"
                                                value={workExperience.workAddress}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ marginBottom: '40px' }}>
                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                value={workExperience.designation}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        </Grid>

                                        <>
                                            <Box sx={{position:'relative',left:'1.5%',width:'98%',marginBottom:'20px'}}>
                                                <Paper elevation={3} sx={{ p: 4, maxWidth: 1800, margin: '0 auto' }}>
                                                    <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: '40px' }}>
                                                        Products
                                                    </Typography>
                                                    <ProductTable
                                                        products={workExperience.products}
                                                        onRemove={handleRemoveProduct}
                                                        onChange={handleProductChange}
                                                        readOnly={true} 
                                                    />
                                                </Paper>
                                            </Box>

                                        </>

                                        <Grid item xs={12} sm={6} sx={{marginBottom:'20px'}}>
                                            <TextField
                                                fullWidth
                                                label="Do you have a patent?"
                                                value={workExperience.hasPatent}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        {workExperience.hasPatent === 'Yes' && (
                                            <Grid item xs={12} > 
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    label="Patent Details"
                                                    value={workExperience.patentDetails}
                                                    InputProps={{ readOnly: true }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                    <Grid container spacing={3}>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        Categories
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        sx={{ width: '100%' }}
                                        value={categories.join(', ')}
                                        variant="outlined"
                                        multiline
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        Subcategories
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        sx={{ width: '100%' }}
                                        value={subcategories.join(', ')}
                                        variant="outlined"
                                        multiline
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                                </Paper>
                            )}
                        </Box>

                        



                        {fetchError && (
                            <Typography color="error" align="center" mt={2}>
                                {fetchError}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button variant="contained" sx={{ bgcolor: '#616161', ':hover': { bgcolor: '#616161' } }} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                            </Button>
                        </Box>
                        {/* </Box> */}
                    </Form>
                )}
            </Formik>
        </Drawer>

    );
};
