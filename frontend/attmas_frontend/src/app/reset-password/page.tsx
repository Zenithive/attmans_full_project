"use client"
import { Box, Button, CircularProgress, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { Suspense } from 'react';
import axiosInstance from '../services/axios.service';
import { APIS } from '../constants/api.constant';
import { useRouter, useSearchParams } from 'next/navigation';

const Page: React.FC = () => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const resetPasswordId = searchParams.get('id');
        const response = await axiosInstance.post(APIS.RESET_PASSOWRD, { resetPasswordId, password: values.password });


        if (response.data.error) {
          // Set an error status and return if email is not verified
          formik.setStatus({ error: 'There is error while reseting password, make sure you enter valid email.' });
          return;
        }

        formik.setStatus({ success: 'Password changed successfully.' });
        router.push("/");

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
          Set A New Password
        </Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                color='secondary'
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                color='secondary'
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

const SuspenseResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

export default SuspenseResetPasswordPage;
