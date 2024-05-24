import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';





interface SignUpProps {
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

// const defaultTheme = createTheme();

// Create a custom theme with more rounded input borders
const customTheme = createTheme({
  shape: {
    borderRadius: 20, // Change this value to make the borders more or less rounded
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: 12, 
            },
          },
        },
      },
    },
  },
});

const SignUp: React.FC<SignUpProps> = ({toggleForm}) => {
  const router = useRouter();
  const [formValues, setFormValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const [emailError, setEmailError] = useState<string | null>(null);
  // const [passwordError, setPasswordError] = useState<string | null>(null);
  // const [mobileNumberError, setMobileNumberError] = useState<string | null>(null);
  // const [firstNameError, setFirstNameError] = useState<string | null>(null);
  // const [lastNameError, setLastNameError] = useState<string | null>(null);
  // const router = useRouter();
  


  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // const validatePassword = (password: string) => {
  //   return password.length >= 6;
  // };

  // const validateMobileNumber = (mobileNumber: string) => {
  //   const mobileNumberRegex = /^\d{10}$/;
  //   return mobileNumberRegex.test(mobileNumber);
  // };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;
  const validateMobileNumber = (mobileNumber: string) => /^\d{10}$/.test(mobileNumber);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // if (name === 'email') {
    //   if (!validateEmail(value)) {
    //     setEmailError('Invalid email address');
    //   } else {
    //     setEmailError(null);
    //   }
    // }

    // if (name === 'password') {
    //   if (!validatePassword(value)) {
    //     setPasswordError('Password must be at least 6 characters');
    //   } else {
    //     setPasswordError(null);
    //   }
    // }

    // if (name === 'mobileNumber') {
    //   if (!validateMobileNumber(value)) {
    //     setMobileNumberError('Mobile number must be exactly 10 digits');
    //   } else {
    //     setMobileNumberError(null);
    //   }
    // }

    // if (name === 'firstName') {
    //   if (!value.trim()) {
    //     setFirstNameError('First name is required');
    //   } else {
    //     setFirstNameError(null);
    //   }
    // }

    // if (name === 'lastName') {
    //   if (!value.trim()) {
    //     setLastNameError('Last name is required');
    //   } else {
    //     setLastNameError(null);
    //   }
    // }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { firstName, lastName, email, password, mobileNumber } = formValues;

    // if (!firstName.trim()) {
    //   setFirstNameError('First name is required');
    //   return;
    // }

    // if (!lastName.trim()) {
    //   setLastNameError('Last name is required');
    //   return;
    // }

    // if (!validateEmail(email)) {
    //   setEmailError('Invalid email address');
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   setPasswordError('Password must be at least 6 characters');
    //   return;
    // }

    // if (!validateMobileNumber(mobileNumber)) {
    //   setMobileNumberError('Mobile number must be exactly 10 digits');
    //   return;
    // }

    if (!firstName.trim() || !lastName.trim() || !validateEmail(email) || !validatePassword(password) || !validateMobileNumber(mobileNumber)) {
      setError('Please fill all fields correctly.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/users', {
        firstName,
        lastName,
        username: email,
        password,
        mobileNumber,
      });
      setSuccess('Successfully signed up!');
      setError(null);
      // Reset form values
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: '',
      });
      // router.push('/homepage');
    } catch (error) {
      console.log("error", error);
      setError('Failed to sign up. Please try again.');
      setSuccess(null);
    }
  };

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formValues.firstName}
                  onChange={handleChange}
                  // error={!!firstNameError}
                  // helperText={firstNameError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formValues.lastName}
                  onChange={handleChange}
                  // error={!!lastNameError}
                  // helperText={lastNameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  // error={!!emailError}
                  // helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleChange}
                  // error={!!passwordError}
                  // helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="mobileNumber"
                  label="Mobile Number"
                  type="tel"
                  id="mobileNumber"
                  autoComplete="tel"
                  value={formValues.mobileNumber}
                  onChange={handleChange}
                  // error={!!mobileNumberError}
                  // helperText={mobileNumberError}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" color="success" align="center">
                {success}
              </Typography>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={toggleForm}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
