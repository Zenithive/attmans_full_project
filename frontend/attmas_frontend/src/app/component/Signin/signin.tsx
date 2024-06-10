"use client";
import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { APIS } from '../../constants/api.constant';
import Image from 'next/image';
import { addUser } from '@/app/reducers/userReducer';
import { useAppDispatch } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import Link from 'next/link';

interface SignInProps {
  toggleForm: CallableFunction;
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

export const SignIn = ({ toggleForm }: SignInProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // const dispatch = useAppDispatch();

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
        console.log("response.data.access_token", response.data.access_token);
        console.log("response", response.data.user);

        const res = response.data.user;
        const user = {
          token: response.data.access_token,
          username: values.email,
          firstname: res.firstname,
          lastname: res.lastname,
          mobilenumber: res.mobilenumber,
          // _id: res._id,
        };
        console.log("user", user)

        dispatch(addUser(user))
        document.cookie = `access_token=${response.data.access_token}`;
        formik.setStatus({ success: 'Successfully signed in!' });
        if (response.data.user._doc.isAllProfileCompleted ||
          ["innoveters", "freelancer", "business"].includes(response.data.user._doc.userType)) {
          router.push("/dashboard");
        }
        else {
          router.push("/profile");
        }
      } catch (error) {
        formik.setStatus({ error: 'Failed to sign in. Please check your credentials and try again.' });
      }
    }
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
          <FormControlLabel
            control={<Checkbox value="remember" />}
            color='secondary'
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color='secondary'
            sx={{ mt: 3, mb: 2 }}
          >Sign In</Button>
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
              <Link href="#" color='secondary'>
                Forgot password?
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

