"use client"
import { Box, Button, CircularProgress, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import axiosInstance from '../services/axios.service';
import { APIS } from '../constants/api.constant';

const Page: React.FC = () => {

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post(APIS.FORGOT_PASSOWRD, { username: values.email });


        if (response.data.error) {
          // Set an error status and return if email is not verified
          formik.setStatus({ error: 'There is error while reseting password, make sure you enter valid email.' });
          return;
        }

        formik.setStatus({ success: 'Password reset link shared on email address.' });

      } catch (error) {
        if (error instanceof AxiosError) {
          
            formik.setStatus({ error: error.response?.data.message });
          
        } else {
          formik.setStatus({ error: 'An unexpected error occurred.' });
        }
      }
    },

  });
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                color='secondary'
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            disabled={formik.isSubmitting}
            variant="contained"
            color='secondary'
            sx={{ mt: 3, mb: 2 }}
          >
            {formik.isSubmitting ? <CircularProgress /> : 'Submit'}
          </Button>
          {formik.status && formik.status.error && (
            <Typography variant="body2" color="error" align="center">
              {formik.status.error}
            </Typography>
          )}
          {formik.status && formik.status.success && (
            <Typography variant="body2" color="success" align="center">
              {formik.status.success}
            </Typography>
          )}

          <Grid container>
            <Grid item>
              <Link href="/" color='secondary'>
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" color='secondary'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;
