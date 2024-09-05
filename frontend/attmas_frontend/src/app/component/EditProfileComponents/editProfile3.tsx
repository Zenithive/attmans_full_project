"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress, Chip, Stack, Autocomplete, TextField, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation'; // Assuming it's next/router for routing
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import { categories, options } from '@/app/constants/categories';
import axiosInstance from '@/app/services/axios.service';

type Option = {
  label: string;
  value: string;
  children?: Option[];
};

const EditProfile3: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const formik = useFormik({
    initialValues: {
      username: userDetails.username,
      userId: userDetails._id,
      subcategories: [] as string[],
      categories: [] as string[], // Changed preferredIndustries to categories
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axiosInstance.post(APIS.FORM3, values);
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
        const response = await axiosInstance.get(`/profile/profileByUsername3?username=${userDetails.username}`);
        const userData = response.data;
        console.log('userData',userData);
        formik.setValues({
          ...formik.values,
          subcategories: userData.subcategories || [],
          categories: userData.categories || [], // Changed preferredIndustries to categories
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

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    let updatedSelectedValues = [...selectedValues];
    if (isChecked) {
      updatedSelectedValues.push(value);
    } else {
      updatedSelectedValues = updatedSelectedValues.filter(v => v !== value);
    }
    setSelectedValues(updatedSelectedValues);
    formik.setFieldValue('subcategories', updatedSelectedValues);
  };

  const handleCategoryCheckboxChange = (value: string, isChecked: boolean) => {
    let updatedCategories = [...formik.values.categories];
    if (isChecked) {
      updatedCategories.push(value);
    } else {
      updatedCategories = updatedCategories.filter(v => v !== value);
    }
    formik.setFieldValue('categories', updatedCategories);
  };

  const filterOptions = (options: Option[], searchTerm: string): Option[] => {
    return options.reduce<Option[]>((acc, option) => {
      const match = option.label.toLowerCase().includes(searchTerm.toLowerCase());
      const children = option.children ? filterOptions(option.children, searchTerm) : [];
      if (match || children.length > 0) {
        acc.push({ ...option, children: children.length > 0 ? children : undefined });
      }
      return acc;
    }, []);
  };

  const renderOptions = (options: Option[], level: number = 0) => {
    return options.map(option => (
      <div key={option.value} style={{ paddingLeft: `${level * 20}px` }}>
        {option.children ? (
          <div>
            <div className="parent-option" style={{ fontWeight: 'bold' }}>
              {option.label}
            </div>
            {renderOptions(option.children, level + 1)}
          </div>
        ) : (
          <label>
            <Checkbox
              color='secondary'
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={e => handleCheckboxChange(option.value, e.target.checked)}
            />
            {option.label}
          </label>
        )}
      </div>
    ));
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = filterOptions(options, searchTerm);

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
          '@media (max-width: 767px)': {
            width: '105%',
            position: 'relative',
            left: '7%'
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between',
        '@media (max-width: 767px)': {
                       width:'121%',position:'relative',right:'26px'
                    } }}>
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
                  label="Preferred Category"
                  placeholder="Select categories"
                  color="secondary"
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    color='secondary'
                    checked={selected}
                    onChange={(e) => handleCategoryCheckboxChange(option, e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  {option}
                </li>
              )}
              sx={{ width: { xs: '100%', md: '45%' }, marginBottom: { xs: 2, md: 0 } }}
            />
            <Box className="nested-multiselect-dropdown"
              ref={dropdownRef}
              sx={{ width: { xs: '100%', md: '50%' } }}>
              <button type="button" onClick={handleToggleDropdown} style={{ width: '100%', minHeight: '57.5px' }}>
                {selectedValues.length > 0 ? (
                  selectedValues.map(value => (
                    <Chip
                      key={value}
                      label={value}
                      onDelete={() => handleCheckboxChange(value, false)}
                      color="primary"
                      style={{ marginRight: 5, marginBottom: 5 }}
                    />
                  ))
                ) : (
                  'Subject matter expertise'
                )}
              </button>
              {isOpen && (
                <div className="dropdown-content">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <div className="options-container">
                    {renderOptions(filteredOptions)}
                  </div>
                </div>
              )}
            </Box>
          </Box>
          <Box mt={3} display="flex" justifyContent="center">
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={loading}
              loadingIndicator={<CircularProgress size={24} />}
            >
              Update Subject matter expertise
            </LoadingButton>
          </Box>
        </Box>
      </Box>


      <style jsx>{`
    .nested-multiselect-dropdown {
      position: relative;
      display: inline-block;
      width: 560px;
    }

    .dropdown-content {
      display: block;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 560px;
      max-height: 300px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 12px 16px;
      z-index: 1;
      border: 1px solid #ccc;
      overflow-y: auto;
    }

    .options-container {
      max-height: 200px;
      overflow-y: auto;
    }

    .nested-multiselect-dropdown label {
      display: block;
      margin-bottom: 5px;
    }

    .parent-option {
      cursor: pointer;
    }

    .parent-option:hover {
      background-color: #f1f1f1;
    }

    .selected-values {
      margin-bottom: 10px;
    }

    .selected-values strong {
      display: inline-block;
      margin-right: 5px;
    }

    button {
      margin-right: 10px;
      width: 514px; /* Decrease width */
        @media (max-width: 767px){
        width: 170px;
      };
      border-radius: 20px;
      background-color: white;
      min-height: 57px; /* Increase height */
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      border: 1px solid #ccc; /* Thin border */
    }

    .dropdown-content input {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  `}</style>

    </Container>
  );
};

export default EditProfile3;


