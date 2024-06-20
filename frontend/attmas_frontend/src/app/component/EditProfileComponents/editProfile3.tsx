"use client";
import React, { useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import { categories, subcategories } from '@/app/constants/categories';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';

const customTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(0,23,98)",
    },
  },
  shape: {
    borderRadius: 20,
  },
});

function getStyles(name: string, selectedCategories: string[], theme: any) {
  return {
    fontWeight:
      selectedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}



const EditProfile3: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null); // State to hold fetch error
  const router = useRouter();

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const formik = useFormik({
    initialValues: {
      username: userDetails.username,
      categories: [] as string[],
      subcategories: [] as string[],
    },
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(APIS.FORM3, values);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error sending data:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/profile/profileByUsername3?username=${userDetails.username}`); // Adjust endpoint as per your backend API
        const userData = response.data; 

        // Update formik values with fetched data
        formik.setValues({
          ...formik.values,
          categories: userData.categories || [],
          subcategories: userData.subcategories || [],
        });

        setSelectedCategories(userData.categories || []);
        setSelectedSubcategories(userData.subcategories || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFetchError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userDetails.username]);

  const handleCategoryChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    setSelectedSubcategories([]);
    formik.setFieldValue('categories', value);
    formik.setFieldValue('subcategories', []);
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<typeof selectedSubcategories>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubcategories(typeof value === 'string' ? value.split(',') : value);
    formik.setFieldValue('subcategories', value);
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
          Category
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          View and Change your category here
        </Typography>

        {fetchError && (
          <Typography variant="body2" color="error" align="center">
            {fetchError}
          </Typography>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel color='secondary' id="categories-label">Categories</InputLabel>
                <Select
                  labelId="categories-label"
                  id="categories"
                  name="categories"
                  color='secondary'
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category} style={getStyles(category, selectedCategories, customTheme)}>
                      <Checkbox color='secondary' checked={selectedCategories.indexOf(category) > -1} />
                      <ListItemText primary={category} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedCategories.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel color='secondary' id="subcategories-label">Subcategories</InputLabel>
                  <Select
                    labelId="subcategories-label"
                    id="subcategories"
                    color='secondary'
                    name="subcategories"
                    multiple
                    value={selectedSubcategories}
                    onChange={handleSubcategoryChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Subcategories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {selectedCategories.flatMap(category =>
                      subcategories[category].map((subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          <Checkbox color='secondary' checked={selectedSubcategories.indexOf(subcategory) > -1} />
                          <ListItemText primary={subcategory} />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>

            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={loading}
              loadingIndicator={<CircularProgress size={24} />}
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
