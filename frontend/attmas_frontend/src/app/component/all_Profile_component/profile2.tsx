"use client";
import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    MenuItem,
    TextField,
    Typography,
    FormHelperText,
    CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { APIS } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';


interface ProfileForm2Props {
    onNext: () => void;
    onPrevious: () => void;
}

const ProfileForm2: React.FC<ProfileForm2Props> = ({ onNext, onPrevious }) => {
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [loading, setLoading] = useState(false);

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
            userId: userDetails._id,
            username: userDetails.username,
        },



        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                console.log('userDetails._id from 2nd', userDetails._id);

                const response = await axios.post(APIS.FORM2, values);
                console.log('Profile data saved:', response.data);
                onNext();
            } catch (error) {
                console.error('There was an error saving the profile data!', error);
            } finally {
                setLoading(false);
            }
        },
    });

    const handleUserTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        formik.handleChange(event);
        if (event.target.value === 'Freelancer') {
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
                                multiline
                                rows={3} // Adjust the number of rows as needed
                                style={{ background: "white", borderRadius: "25px" }}
                                id="workAddress"
                                label="Work Address (If any)"
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
                                        padding: '10px', // Adjust the padding as needed
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
                                name="userType"
                                value={formik.values.userType}
                                onChange={handleUserTypeChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.userType && Boolean(formik.errors.userType)}
                            >
                                <MenuItem value="Freelancer">Freelancer</MenuItem>
                                <MenuItem value="Business">Business</MenuItem>
                                <MenuItem value="Innovators">Innovators</MenuItem>
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
            </Box>
        </Container>
    );
};

export default ProfileForm2;
