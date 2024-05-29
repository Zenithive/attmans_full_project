"use client";
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { APIS } from '../constants/api.constant';
import Cookies from 'js-cookie';

interface SignInProps {
  toggleForm: () => void;
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// const customTheme = createTheme({
//   shape: {
//     borderRadius: 20,
//   },
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderRadius: 20,
//             },
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 20,
//           textTransform: 'none',
//         },
//       },
//     },
//   },
// });

const customTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(0,23,98)",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: 20,
              borderColor: "rgb(0,23,98)",
            },
            '&:hover fieldset': {
              borderColor: "rgb(0,23,98)",
            },
            '&.Mui-focused fieldset': {
              borderColor: "rgb(0,23,98)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          backgroundColor: "rgb(0,23,98)",
          '&:hover': {
            backgroundColor: "rgb(0,23,98)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "rgb(0,23,98)",
          '&:hover': {
            color: "rgb(0,23,98)",
          },
        },
      },
    },
  },
});

const SignIn: React.FC<SignInProps> = ({ toggleForm }) => {
  const router = useRouter();

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
        const response = await axios.post(APIS.LOGIN, { username: values.email, password: values.password });
        console.log("response.data.requiresProfileCompletion", response.data.user.requiresProfileCompletion);

        if (response.data.user.requiresProfileCompletion) {
          // Redirect to profile completion page
          router.push("/profile");
        } else {
          // Store the token and redirect to dashboard
          Cookies.set("access_token", response.data.access_token, { expires: 1 });
          formik.setStatus({ success: 'Successfully signed in!' });
          router.push("/dashboard");
        }
      } catch (error) {
        formik.setStatus({ error: 'Failed to sign in. Please check your credentials and try again.' });
      }
    }
  });

  return (
    <ThemeProvider theme={customTheme}>
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            // disabled={loading}
            >
              Sign In


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
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={toggleForm}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
