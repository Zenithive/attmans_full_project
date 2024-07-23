import React from 'react';
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
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close'; 
import { Formik, Field, FieldArray, Form, FieldProps, FormikErrors } from 'formik';
import * as Yup from 'yup';

interface BoothDetailsModalProps {
  open: boolean;
  onClose: () => void;
  createBooth: (boothData: any) => Promise<void>;
  exhibitionId: string | null;
}

interface Product {
  name: string;
  description: string;
  productType: string;
  price: string;
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
      error={Boolean(productTouched && productErrors && productErrors.price)}
      helperText={(productTouched && productErrors && productErrors.price) || (productTouched && productErrors && productErrors.currency)}
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

  const initialValues = {
    title: '',
    description: '',
    videoUrl: '',
    products: [{ name: '', description: '', productType: '', price: '', currency: 'INR' ,videourlForproduct:'',}] as Product[],
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
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Product description is required'),
        productType: Yup.string().required('Product type is required'),
        price: Yup.number().required('Product price is required').min(0, 'Price cannot be negative'),
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
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
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
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Product Type</TableCell>
                          <TableCell>Price & Currency</TableCell>
                          <TableCell>Video</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Field name={`products.${index}.name`}>
                                {({ field, form }: FieldProps) => {
                                  const productErrors = (form.errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                  const productTouched = (form.touched.products as boolean[] | undefined)?.[index];
                                  return (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      label="Product Name"
                                      color='secondary'
                                      error={Boolean(productTouched && productErrors && productErrors.name)}
                                      helperText={productTouched && productErrors && productErrors.name}
                                    />
                                  );
                                }}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`products.${index}.description`}>
                                {({ field, form }: FieldProps) => {
                                  const productErrors = (form.errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                  const productTouched = (form.touched.products as boolean[] | undefined)?.[index];
                                  return (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      label="Product Description"
                                      color='secondary'
                                      error={Boolean(productTouched && productErrors && productErrors.description)}
                                      helperText={productTouched && productErrors && productErrors.description}
                                      multiline
                                    />
                                  );
                                }}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`products.${index}.productType`}>
                                {({ field, form }: FieldProps) => {
                                  const productErrors = (form.errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                  const productTouched = (form.touched.products as boolean[] | undefined)?.[index];
                                  return (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      label="Product Type"
                                      color='secondary'
                                      error={Boolean(productTouched && productErrors && productErrors.productType)}
                                      helperText={productTouched && productErrors && productErrors.productType}
                                    />
                                  );
                                }}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`products.${index}.price`}>
                                {({ field, form }: FieldProps) => (
                                  <CustomPriceField field={field} form={form} index={index} />
                                )}
                              </Field>
                            </TableCell>
                             <TableCell>
                              <Field name={`products.${index}.videourlForproduct`}>
                                {({ field, form }: FieldProps) => {
                                  const productErrors = (form.errors.products as FormikErrors<Product>[] | undefined)?.[index];
                                  const productTouched = (form.touched.products as boolean[] | undefined)?.[index];
                                  return (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      label="Video"
                                      color='secondary'
                                      error={Boolean(productTouched && productErrors && productErrors.videourlForproduct)}
                                      helperText={productTouched && productErrors && productErrors.videourlForproduct}
                                    />
                                  );
                                }}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => remove(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Button
                              type="button"
                              variant="outlined"
                              onClick={() => push({ name: '', description: '', productType: '', price: 0, currency: 'USD' })}
                              startIcon={<AddIcon />}
                            >
                              Add Product
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                )}
              </FieldArray>

              <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }} disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default BoothDetailsModal;
