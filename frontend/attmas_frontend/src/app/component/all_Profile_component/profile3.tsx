import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress, Autocomplete, TextField, Button, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import { categories, options } from '@/app/constants/categories';
import SubjectMatterExpertise from '../SubjectMatterExpertise';
import TermsAndConditionsModal from './TermsAndConditionsModal'; // Import the new modal component

interface ProfileForm3Props {
  onPrevious: () => void;
}

const ProfileForm3: React.FC<ProfileForm3Props> = ({ onPrevious }) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const router = useRouter();
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const formik = useFormik({
    initialValues: {
      username: userDetails.username,
      userId: userDetails._id,
      subcategories: [] as string[],
      categories: [] as string[],
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post(`${APIS.FORM3}?username=${userDetails.username}`, values);
        pubsub.publish('toast', {
          message: 'Profile updated successfully!',
          severity: 'success',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
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
          categories: [],
        });
        setSelectedValues(userData.subcategories || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFetchError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userDetails.username]);

  const handleCategoryCheckboxChange = (value: string, isChecked: boolean) => {
    let updatedCategories = [...formik.values.categories];
    if (isChecked) {
      updatedCategories.push(value);
    } else {
      updatedCategories = updatedCategories.filter(v => v !== value);
    }
    formik.setFieldValue('categories', updatedCategories);
  };

  const handleSaveClick = () => {
    setIsModalOpen(true); // Open the modal when "Save" is clicked
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    formik.handleSubmit(); // Submit the form when "OK" is clicked in the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal when "Cancel" is clicked
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          border: '1px solid #616161',
          borderRadius: 2,
          width: '142.5%',
          position: 'relative',
          right: '180px',
          bottom: "60px",
          boxShadow: 5,
          '@media (max-width: 767px)': {
            position: 'relative',
            width: '120%',
            right: '31px',
          }
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Autocomplete
              multiple
              id="categories"
              options={categories}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              value={formik.values.categories}
              onChange={(event, newValue) => formik.setFieldValue('categories', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Categories"
                  placeholder="Select categories"
                  color="secondary"
                  sx={{ width: '100%' }}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    color="secondary"
                    checked={selected}
                    onChange={(e) => handleCategoryCheckboxChange(option, e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  {option}
                </li>
              )}
              sx={{ width: '100%', maxWidth: { xs: '100%', md: '45%' } }}
            />

            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '45%' } }}>
              <SubjectMatterExpertise
                selectedValues={selectedValues}
                setSelectedValues={(values) => {
                  setSelectedValues(values);
                  formik.setFieldValue('subcategories', values);
                }}
                options={options}
                Option={[]}
                value={[]}
                onChange={(selectedSubjects: string[]): void => {}}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              type="button"
              variant="contained"
              size="small"
              sx={{ px: 3, py: 1 }}
              onClick={onPrevious}
            >
              Back
            </Button>

            <LoadingButton
              loading={loading}
              onClick={handleSaveClick} // Open modal instead of direct submission
              type="button" // Change to button to avoid default form submission
              variant="contained"
              size="small"
              sx={{ px: 3, py: 1 }}
              color="primary"
            >
              Save
            </LoadingButton>
          </Box>
        </Box>

        {/* Include the Terms and Conditions Modal */}
        <TermsAndConditionsModal
          open={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      </Box>
    </Container>
  );
};

export default ProfileForm3;
