"use client"
import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import NestedMultiselectDropdown from '../nested multiple select dropdown/nested_multiple_select_dropdown'; // Update path as per your project structure
import { options } from '@/app/constants/categories';

const EditProfile3: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const formik = useFormik({
    initialValues: {
      username: userDetails.username,
      userId: userDetails._id,

      subcategories: [] as string[],
    },
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(APIS.FORM3, values);
        pubsub.publish('toast', {
          message: 'Profile updated successfully!',
          severity: 'success',
        });
        // Optionally, redirect to another page after a delay
        // setTimeout(() => {
        //   router.push('/dashboard');
        // }, 3000); // 3000 milliseconds = 3 seconds
      } catch (error) {
        console.error('Error updating profile:', error);
        pubsub.publish('toast', {
          message: 'Failed to update profile. Please try again later.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/profile/profileByUsername3?username=${userDetails.username}`);
        const userData = response.data;

        formik.setValues({
          ...formik.values,
          subcategories: userData.subcategories || [],
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFetchError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userDetails.username]);

  const handleSelectionChange = (selectedValues: string[]) => {
    formik.setFieldValue('subcategories', selectedValues); // Update formik values with selected subcategories
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
          Subject matter expertise
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          View and Change your Subject matter expertise here
        </Typography>

        {fetchError && (
          <Typography variant="body2" color="error" align="center">
            {fetchError}
          </Typography>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <NestedMultiselectDropdown options={options} onChange={handleSelectionChange} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={loading}
              loadingIndicator={<CircularProgress size={24} />}
              sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }}
            >
              Save
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile3;
