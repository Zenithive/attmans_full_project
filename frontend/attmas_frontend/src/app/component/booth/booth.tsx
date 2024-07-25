import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, FieldArray, Form, FieldProps, FormikErrors } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import Autocomplete from '@mui/material/Autocomplete';

interface BoothDetailsModalProps {
  open: boolean;
  onClose: () => void;
  createBooth: (boothData: any) => Promise<void>;
  exhibitionId: string | null;
}

interface Product {
  productName: string;
  productDescription: string;
  productType: string;
  productPrice: string;
  currency: string;
  videourlForproduct: string;
}

const CustomPriceField = ({ field, form, index }: { field: any; form: any; index: number }) => {
  const productErrors = (form.errors.products as FormikErrors<Product>[] | undefined)?.[index];
  const productTouched = (form.touched.products as boolean[] | undefined)?.[index];

  return (
    <TextField
      {...field}
      fullWidth
      label="Product Price"
      color='secondary'
      type="text"
      error={Boolean(productTouched && productErrors && productErrors.productPrice)}
      helperText={(productTouched && productErrors && productErrors.productPrice) || (productTouched && productErrors && productErrors.currency)}
      InputProps={{
        startAdornment: (
          <FormControl variant="standard" sx={{ minWidth: 60 }}>
            <Select
              value={form.values.products[index].currency}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiSelect-select': {
                  borderBottom: 'none',
                },
                '&:before, &:after': {
                  borderBottom: 'none !important',
                },
              }}
              onChange={(event) => form.setFieldValue(`products.${index}.currency`, event.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Currency' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 100,
                  },
                },
              }}
            >
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl>
        ),
      }}
    />
  );
};

const BoothDetailsModal: React.FC<BoothDetailsModalProps> = ({ open, onClose, createBooth, exhibitionId }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${APIS.PRODUCTNAME}?username=${userDetails.username}`);
        console.log("response of Products ", response.data);
        setProductDetails(response.data || []);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    if (userDetails._id) {
      fetchProductDetails();
    }
  }, [userDetails._id]);

  const initialValues = {
    title: '',
    description: '',
    videoUrl: '',
    products: [{ productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR', videourlForproduct: '' }] as Product[],
    userId: userDetails._id,
    username: userDetails.username,
    exhibitionId: exhibitionId || '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    videoUrl: Yup.string().url('Invalid URL').required('Video URL is required'),
    products: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        productDescription: Yup.string().required('Product description is required'),
        productType: Yup.string().required('Product type is required'),
        productPrice: Yup.number().required('Product price is required').min(0, 'Price cannot be negative'),
        currency: Yup.string().required('Currency is required'),
        videourlForproduct: Yup.string().url('Invalid URL').required('Video URL is required'),
      })
    ),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      await createBooth(values);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating booth:', error);
    }
  };

  const handleProductSelect = (index: number, selectedProductName: string, setFieldValue: any) => {
    const selectedProduct = productDetails.find(product => product.productName === selectedProductName);
    if (selectedProduct) {
      setFieldValue(`products.${index}.productDescription`, selectedProduct.productDescription);
      setFieldValue(`products.${index}.productType`, selectedProduct.productType);
      setFieldValue(`products.${index}.productPrice`, selectedProduct.productPrice);
      setFieldValue(`products.${index}.currency`, selectedProduct.currency);
      setFieldValue(`products.${index}.videourlForproduct`, selectedProduct.videourlForproduct);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          bgcolor: 'white',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
          maxHeight: '90vh',
          borderRadius: '20px',
          '@media (max-width: 767px)': {
            width: '78%',
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2">
          Booth Details
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>
              <TextField
                fullWidth
                label="Title"
                name="title"
                color='secondary'
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                color='secondary'
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Video URL"
                name="videoUrl"
                color='secondary'
                value={values.videoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.videoUrl && errors.videoUrl)}
                helperText={touched.videoUrl && errors.videoUrl}
              />
              <Typography variant="h6" component="h2" style={{ marginTop: '20px' }}>
                Products
              </Typography>
              <FieldArray name="products">
                {({ push, remove }) => (
                  <>
                    {isMobile ? (
                      <Grid container spacing={2}>
                        {values.products.map((product, index) => (
                          <Grid item xs={12} key={index}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Field name={`products.${index}.productName`}>
                                  {({ field }: FieldProps) => {
                                    const productErrors = (errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                    const productTouched = (touched.products as boolean[] | undefined)?.[index];
                                    return (
                                      <Autocomplete
                                        options={productDetails.map(product => product.productName)}
                                        getOptionLabel={(option) => option}
                                    
                                        onChange={(event, value) => {
                                          if (value !== null) {
                                            handleProductSelect(index, value, setFieldValue);
                                          }
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            {...field}
                                            label="Product Name"
                                            color='secondary'
                                            error={Boolean(productTouched && productErrors && productErrors.productName)}
                                            helperText={productTouched && productErrors && productErrors.productName}
                                          />
                                        )}
                                      />
                                    );
                                  }}
                                </Field>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Product Description"
                                  name={`products.${index}.productDescription`}
                                  color='secondary'
                                  value={values.products[index].productDescription}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Product Type"
                                  name={`products.${index}.productType`}
                                  color='secondary'
                                  value={values.products[index].productType}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productType &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productType
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productType &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productType
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Field name={`products.${index}.productPrice`}>
                                  {({ field, form }: FieldProps) => (
                                    <CustomPriceField field={field} form={form} index={index} />
                                  )}
                                </Field>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Video URL for Product"
                                  name={`products.${index}.videourlForproduct`}
                                  color='secondary'
                                  value={values.products[index].videourlForproduct}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <IconButton onClick={() => remove(index)} disabled={isSubmitting}>
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Product Description</TableCell>
                            <TableCell>Product Type</TableCell>
                            <TableCell>Product Price</TableCell>
                            <TableCell>Video URL</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Field name={`products.${index}.productName`}>
                                  {({ field }: FieldProps) => {
                                    const productErrors = (errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                    const productTouched = (touched.products as boolean[] | undefined)?.[index];
                                    return (
                                      <Autocomplete
                                        options={productDetails.map(product => product.productName)}
                                        getOptionLabel={(option) => option}
                                        onChange={(event, value) => {
                                          if (value !== null) {
                                            handleProductSelect(index, value, setFieldValue);
                                          }
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            {...field}
                                            label="Product Name"
                                            color='secondary'
                                            error={Boolean(productTouched && productErrors && productErrors.productName)}
                                            helperText={productTouched && productErrors && productErrors.productName}
                                          />
                                        )}
                                      />
                                    );
                                  }}
                                </Field>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  label="Product Description"
                                  name={`products.${index}.productDescription`}
                                  color='secondary'
                                  value={values.products[index].productDescription}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productDescription
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  label="Product Type"
                                  name={`products.${index}.productType`}
                                  color='secondary'
                                  value={values.products[index].productType}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productType &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productType
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.productType &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.productType
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Field name={`products.${index}.productPrice`}>
                                  {({ field, form }: FieldProps) => (
                                    <CustomPriceField field={field} form={form} index={index} />
                                  )}
                                </Field>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  label="Video URL for Product"
                                  name={`products.${index}.videourlForproduct`}
                                  color='secondary'
                                  value={values.products[index].videourlForproduct}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  error={Boolean(
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct
                                  )}
                                  helperText={
                                    (touched.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct &&
                                    (errors.products as FormikErrors<Product>[] | undefined)?.[index]?.videourlForproduct
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => remove(index)} disabled={isSubmitting}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => push({ productName: '', productDescription: '', productType: '', productPrice: '', currency: 'INR', videourlForproduct: '' })}
                      >
                        Add Product
                      </Button>
                    </Box>
                  </>
                )}
              </FieldArray>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default BoothDetailsModal;
  