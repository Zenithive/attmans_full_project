import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { APIS } from '../../constants/api.constant';
import Image from 'next/image';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import axiosInstance from '@/app/services/axios.service';

interface SignUpProps {
  showLinks?: boolean;
  onSignUpSuccess?: () => void;
  userType?: string;
  isAllProfileCompleted?: boolean;
  interestType: 'InterestedUserForExhibition' | 'InterestedUserForBooth'; 
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://attmans.netlify.app/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export const SignUp = ({ showLinks = true, onSignUpSuccess, userType = "non", isAllProfileCompleted = false }: SignUpProps) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      isEmailVerified: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('Password is required'),
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Mobile number is required'),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
        await axiosInstance.post(APIS.SIGNUP, {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.email,
          password: values.password,
          mobileNumber: values.mobileNumber,
          userType,
          isAllProfileCompleted,
          isEmailVerified: values.isEmailVerified,
        });
        setStatus({ success: 'Successfully signed up!' });
        
        if (onSignUpSuccess) {
          onSignUpSuccess();
        } else {
          router.push('/');
        }
      } catch (error: any) {
        setStatus({ error: error.response.data.message });
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
        <Image src="/attmans (png)-01.png" alt="attmans logo" width={150} height={130} />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                color='secondary'
                fullWidth
                id="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                color='secondary'
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                color='secondary'
                name="password"
                label="Password"
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
                name="mobileNumber"
                label="Mobile Number"
                type="tel"
                id="mobileNumber"
                autoComplete="tel"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
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
            {formik.isSubmitting ? <CircularProgress /> : 'Sign Up'}
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
          {showLinks && (
            <Grid container>
              <Grid item>
                <Link href="/" color='secondary'>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}