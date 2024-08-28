"use client";
import React from 'react';
import { Box, CircularProgress, Container, CssBaseline, Typography, IconButton, Avatar } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import ProfileFormFields from '../ProfileSeprateComponent/ProfileFormFields1';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { pubsub } from '@/app/services/pubsub.service';
import defaultProfileImg from '../../assets/Zenithithive Logo Black PNG  (1).png'


const defaultProfileImgSrc = defaultProfileImg || defaultProfileImg;

interface ProfileForm1Props {
  onNext: () => void;
}

const ProfileForm1: React.FC<ProfileForm1Props> = ({ onNext }) => {
  const [profilePhoto, setProfilePhoto] = React.useState<File | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const userDetails: UserSchema = useAppSelector(selectUserSession);

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

  const handleSubmit = async (values: typeof initialValues) => {
    if (!profilePhoto) {
      alert('Profile photo is required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', profilePhoto as Blob);
      Object.keys(values).forEach(key => {
        formData.append(key, (values as any)[key]);
      });

      await axios.post(APIS.FORM1, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      pubsub.publish('toast', {
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      onNext(); // Call onNext when the form is submitted
    } catch (error) {
      console.error('Error submitting form:', error);
      pubsub.publish('toast', {
        message: 'Failed to update profile. Please try again.',
        severity: 'error',
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
          width: '142.5%', // 
          position: 'relative',
          right: '180px',
          bottom: "60px",
          boxShadow: 5,
          '@media (max-width: 767px)': {
            position:'relative',
            width:'120%',
            right:'31px',
          }
          
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          Personal Details
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          {/* <h1>  */}

          View and Change your personal details here
          {/* </h1> */}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
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

              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <label htmlFor="profile-photo">
                  <IconButton component="span" sx={{ width: 100, height: 100, mb: 2 }}>
                    <Avatar
                      alt="Profile Photo"
                      src={profilePhotoURL || ''}
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
              
              </Box>

              <ProfileFormFields />
              <LoadingButton
                type="submit"
                variant="contained"
                size='small'
                loading={loading}
                loadingIndicator={<CircularProgress size={24} />}
                sx={{ 
                  mt: 2,
                  mb: 2,
                  ml: { xs: 'auto', md: '90%' }, 
                  width: { xs: '100%', md: '10%' }, 
                  height: '40px',
                  position: { xs: 'relative', md: 'static' }, 
                }}
              >
                Save & Next
              </LoadingButton>

            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default ProfileForm1;