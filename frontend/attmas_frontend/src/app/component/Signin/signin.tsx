"use client";
import React, { useEffect, useState } from 'react';
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
import { addUser, removeUser, selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { AxiosError } from 'axios';
import axiosInstance from '@/app/services/axios.service';
import { getRoleBasedAccess } from '@/app/services/user.access.service';

interface SignInProps {
  toggleForm?: CallableFunction;
  showLinks?: boolean;
  onSignInSuccess?: () => void;
  exhibitionId?: string | null;
  boothId?: string | null;
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

export const SignIn = ({ toggleForm, showLinks = true, onSignInSuccess, exhibitionId, boothId, interestType }: SignInProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userDetails: UserSchema = useAppSelector(selectUserSession);


  const [emailVerifiedMessage, setEmailVerifiedMessage] = useState(false);


  // Check if the URL has the message=email_verified and show a message for 3 seconds
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'email_verified') {
      setEmailVerifiedMessage(true);
      setTimeout(() => {
        setEmailVerifiedMessage(false);
      }, 3000); // Hide the message after 3 seconds
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post(APIS.LOGIN, { username: values.email, password: values.password });

        const res = response.data.user;

        if (!res.isEmailVerified) {
          // Set an error status and return if email is not verified
          formik.setStatus({ error: 'Please verify your email from the email sent to you.' });
          return;
        }

        const user = {
          token: response.data.access_token,
          username: values.email,
          firstName: res.firstName,
          lastName: res.lastName,
          mobileNumber: res.mobileNumber,
          userType: res.userType,
          _id: res._id,
          sessionId: res.sessionId,
        };

        dispatch(addUser(user));
        document.cookie = `access_token=${response.data.access_token};`;
        document.cookie = `sessionId=${res.sessionId};`;

        formik.setStatus({ success: 'Successfully signed in!' });

        if (onSignInSuccess) {
          onSignInSuccess();
        } else {
          const {
            isAdmin,
            isFreelancer,
            isInnovator,
            isProjectOwner,
            isVisitor
          } = getRoleBasedAccess(res.userType);

          if (isVisitor) {
            router.push("/exhibition");
          } else if (res.isAllProfileCompleted || isAdmin || isFreelancer || isInnovator || isProjectOwner) {
            router.push("/dashboard");
          } else {
            router.push("/profile");
          }
        }

      } catch (error) {
        if (error instanceof AxiosError) {
          const simulatedError = {
            response: {
              data: {
                message: 'User has already shown interest in this exhibition'
              }
            }
          };

          const errorMessage = (simulatedError).response?.data.message;

          if (errorMessage === 'User has already shown interest in the exhibition') {
            formik.setStatus({ error: 'You have already shown interest for the exhibition.' });
          } else {
            formik.setStatus({ error: 'Failed to sign in. Please check your credentials and try again.' });
          }
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
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image src="/attmans (png)-01.png" alt="attmans logo" width={150} height={130} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Sign in
        </Typography>

          {/* Display email verification message */}
        {emailVerifiedMessage && (
          <Box
            sx={{
              backgroundColor: '#dff0d8',
              color: '#3c763d',
              border: '1px solid #d0e9c6',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '15px',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Email verified successfully!
            </Typography>
          </Box>
        )}
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            color='secondary'
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            color='secondary'
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            fullWidth
            variant="contained"
            color='secondary'
            sx={{ mt: 3, mb: 2 }}
          >{formik.isSubmitting ? <CircularProgress /> : 'Sign In'}</Button>
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
              <Grid item xs>
                <Link href="/forgot-password" color='secondary'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" color='secondary'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
