"use client";
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Container, CssBaseline, Typography, IconButton, Avatar } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProfileFormFields from '../ProfileSeprateComponent/ProfileFormFields1';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { pubsub } from '@/app/services/pubsub.service';

const EditProfile1: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  // const router = useRouter();

  const initialValues = {
    gender: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    linkedIn: '',
    billingAddress: '',
    username: userDetails.username,
  };

  const validationSchema = Yup.object({
    gender: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    // pinCode: Yup.string().required('Required'),
    pinCode: Yup.string()
      .required('Required')
      .matches(/^[0-9]+$/, 'Must be only digits'),
    country: Yup.string().required('Required'),
    linkedIn: Yup.string().url('Invalid URL').required('Required'),
    billingAddress: Yup.string().required('Required'),
  });

  const fetchUserProfile = async (setValues: (values: typeof initialValues) => void) => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/profile/profileByUsername?username=${userDetails.username}`);
      const userData = response.data;
      setValues({
        ...initialValues,
        ...userData,
      });
      if (userData.profilePhotoURL) {
        setProfilePhotoURL(userData.profilePhotoURL);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setFetchError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      await axios.post(APIS.FORM1, values);

      // Publish success toast message
      pubsub.publish('toast', {
        message: 'Profile updated successfully!',
        severity: 'success'
      });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        // router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      pubsub.publish('toast', {
        message: 'Failed to update profile.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
          Personal Details
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          View and Change your personal details here
        </Typography>

        {fetchError && (
          <Typography variant="body2" color="error" align="center">
            {fetchError}
          </Typography>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setValues }) => {
            useEffect(() => {
              fetchUserProfile(setValues);
            }, [setValues]);

            return (
              <Form noValidate>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-photo"
                  type="file"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      const file = event.currentTarget.files[0];
                      setProfilePhoto(file);
                      setProfilePhotoURL(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="profile-photo">
                  <IconButton component="span" sx={{ width: 100, height: 100, mb: 2 }}>
                    <Avatar
                      alt="Profile Photo"
                      src={profilePhotoURL || '/default-profile.png'}
                      sx={{ width: 100, height: 100, mb: 2, mx: 'auto' }}
                    />
                    <CameraAltIcon
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color: 'white',
                        backgroundColor: 'grey',
                        borderRadius: '50%',
                      }}
                    />
                  </IconButton>
                </label>

                <ProfileFormFields />

                {/* <LoadingButton
                  type="submit"
                  variant="contained"
                  size='small'
                  loading={loading}
                  loadingIndicator={<CircularProgress size={24} />}
                  sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }}
                >
                  Save
                </LoadingButton> */}

                <Box mt={3} display="flex" justifyContent="center">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={loading}
                    loadingIndicator={<CircularProgress size={24} />}
                  >
                    Update Personal Details
                  </LoadingButton>
                </Box>


              </Form>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
}

export default EditProfile1;
