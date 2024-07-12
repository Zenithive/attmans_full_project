// "use client"
// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Container, CssBaseline, Typography, CircularProgress, Chip, Stack, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, Button } from '@mui/material';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { useRouter } from 'next/navigation';
// import { useAppSelector } from '@/app/reducers/hooks.redux';
// import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
// import { APIS, SERVER_URL } from '@/app/constants/api.constant';
// import { pubsub } from '@/app/services/pubsub.service';
// import { options } from '@/app/constants/categories';

// interface ProfileForm3Props {
//   onPrevious: () => void;
// }

// type Option = {
//   label: string;
//   value: string;
//   children?: Option[];
// };

// const industryOptions = [
//   "Chemicals",
//   "Agriculture",
//   "Electronics",
//   "Energy",
//   "Environmental and waste management",
//   "Food and beverage",
//   "Healthcare",
//   "Medical devices and equipment",
//   "Mining and metals",
//   "Real estate and construction",
//   "Textiles",
// ];

// const ProfileForm3: React.FC<ProfileForm3Props> = ({ onPrevious }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [selectedValues, setSelectedValues] = useState<string[]>([]);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const userDetails: UserSchema = useAppSelector(selectUserSession);

//   const formik = useFormik({
//     initialValues: {
//       username: userDetails.username,
//       userId: userDetails._id,
//       subcategories: [] as string[],
//       categories: [] as string[], // Changed preferredIndustries to categories
//     },
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         await axios.post(APIS.FORM3, values);
//         pubsub.publish('toast', {
//           message: 'Profile updated successfully!',
//           severity: 'success',
//         });
//         setTimeout(() => {
//           router.push('/dashboard');
//         }, 3000);
//       } catch (error) {
//         console.error('Error updating profile:', error);
//         pubsub.publish('toast', {
//           message: 'Failed to update profile. Please try again later.',
//           severity: 'error',
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${SERVER_URL}/profile/profileByUsername3?username=${userDetails.username}`);
//         const userData = response.data;
//         formik.setValues({
//           ...formik.values,
//           subcategories: userData.subcategories || [],
//           categories: userData.categories || [], // Changed preferredIndustries to categories
//         });
//         setSelectedValues(userData.subcategories || []);
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//         setFetchError('Failed to fetch user profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [userDetails.username]);

//   const handleCheckboxChange = (value: string, isChecked: boolean) => {
//     let updatedSelectedValues = [...selectedValues];
//     if (isChecked) {
//       updatedSelectedValues.push(value);
//     } else {
//       updatedSelectedValues = updatedSelectedValues.filter(v => v !== value);
//     }
//     setSelectedValues(updatedSelectedValues);
//     formik.setFieldValue('subcategories', updatedSelectedValues);
//   };

//   const filterOptions = (options: Option[], searchTerm: string): Option[] => {
//     return options.reduce<Option[]>((acc, option) => {
//       const match = option.label.toLowerCase().includes(searchTerm.toLowerCase());
//       const children = option.children ? filterOptions(option.children, searchTerm) : [];
//       if (match || children.length > 0) {
//         acc.push({ ...option, children: children.length > 0 ? children : undefined });
//       }
//       return acc;
//     }, []);
//   };

//   const renderOptions = (options: Option[], level: number = 0) => {
//     return options.map(option => (
//       <div key={option.value} style={{ paddingLeft: `${level * 20}px` }}>
//         {option.children ? (
//           <div>
//             <div className="parent-option" style={{ fontWeight: 'bold' }}>
//               {option.label}
//             </div>
//             {renderOptions(option.children, level + 1)}
//           </div>
//         ) : (
//           <label>
//             <input
//               type="checkbox"
//               value={option.value}
//               checked={selectedValues.includes(option.value)}
//               onChange={e => handleCheckboxChange(option.value, e.target.checked)}
//             />
//             {option.label}
//           </label>
//         )}
//       </div>
//     ));
//   };

//   const handleToggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const filteredOptions = filterOptions(options, searchTerm);

//   return (
//     <Container component="main" maxWidth="md">
//       <CssBaseline />
//       <Box
//         sx={{
//           marginTop: 8,
//           padding: 4,
//           border: '1px solid #ccc',
//           borderRadius: 2,
//           width: '142.5%',
//           position: 'relative',
//           right: '180px',
//           bottom: "60px",
//           boxShadow: 5,
//         }}
//       >
//         <Typography component="h1" variant="h5" align="center">
//           Subject matter expertise
//         </Typography>
//         <Typography variant="body2" color="text.secondary" align="center" mb={4}>
//           View and Change your Subject matter expertise here
//         </Typography>

//         {fetchError && (
//           <Typography variant="body2" color="error" align="center">
//             {fetchError}
//           </Typography>
//         )}

//         <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <div className="nested-multiselect-dropdown" ref={dropdownRef} style={{ width: '45%' }}>
//               <div className="selected-values">
//                 <strong>Selected Values: </strong>
//                 {selectedValues.length > 0 ? (
//                   <Stack direction="row" spacing={1}>
//                     {selectedValues.map(value => (
//                       <Chip
//                         key={value}
//                         label={value}
//                         onDelete={() => handleCheckboxChange(value, false)} // Handle chip deletion
//                       />
//                     ))}
//                   </Stack>
//                 ) : (
//                   'None'
//                 )}
//               </div>
//               <button type="button" onClick={handleToggleDropdown}>
//                 Subject matter expertise
//               </button>
//               {isOpen && (
//                 <div className="dropdown-content">
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={e => setSearchTerm(e.target.value)}
//                   />
//                   <div className="options-container">
//                     {renderOptions(filteredOptions)}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <FormControl fullWidth sx={{ width: '45%' }}>
//               <InputLabel id="categories-label">Categories</InputLabel>
//               <Select
//                 labelId="categories-label"
//                 id="categories"
//                 multiple
//                 value={formik.values.categories}
//                 onChange={(e) => formik.setFieldValue('categories', e.target.value)}
//                 input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {(selected as string[]).map((value) => (
//                       <Chip key={value} label={value} onDelete={() => formik.setFieldValue('categories', formik.values.categories.filter((category: string) => category !== value))} />
//                     ))}
//                   </Box>
//                 )}
//               >
//                 {industryOptions.map((category) => (
//                   <MenuItem key={category} value={category}>
//                     <Checkbox checked={formik.values.categories.includes(category)} />
//                     {category}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>

//           <Button
//             type="button"
//             variant="contained"
//             size="small"
//             sx={{ mt: 2, mb: 2, px: 3, py: 1, marginLeft: "0.1%", top: '65px' }}
//             onClick={onPrevious}
//           >
//             Back
//           </Button>

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
//             <LoadingButton
//               type="submit"
//               variant="contained"
//               size="small"
//               loading={loading}
//               loadingIndicator={<CircularProgress size={24} />}
//               sx={{ mt: 2, mb: 2, ml: '90%', width: '10%', height: '40px' }}
//             >
//               Save
//             </LoadingButton>
//           </Box>
//         </Box>
//       </Box>
//       <style jsx>{`
//         .nested-multiselect-dropdown {
//           position: relative;
//           display: inline-block;
//         }

//         .dropdown-content {
//           display: block;
//           position: absolute;
//           background-color: #f9f9f9;
//           min-width: 560px;
//           max-height: 300px;
//           box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
//           padding: 12px 16px;
//           z-index: 1;
//           border: 1px solid #ccc;
//           overflow-y: auto;
//         }

//         .options-container {
//           max-height: 200px;
//           overflow-y: auto;
//         }

//         .nested-multiselect-dropdown label {
//           display: block;
//           margin-bottom: 5px;
//         }

//         .parent-option {
//           cursor: pointer;
//         }

//         .parent-option:hover {
//           background-color: #f1f1f1;
//         }

//         .selected-values {
//           margin-bottom: 10px;
//         }

//         .selected-values strong {
//           display: inline-block;
//           margin-right: 5px;
//         }

//         button {
//           margin-right: 10px;
//           background-color: #4CAF50;
//           color: white;
//           width: 570px;
//           border-radius: 20px;
//           height: 50px;
//           padding: 10px 20px;
//           border: none;
//           cursor: pointer;
//         }

//         button:hover {
//           background-color: #45a049;
//         }

//         .dropdown-content input {
//           width: 100%;
//           padding: 5px;
//           margin-bottom: 10px;
//           border: 1px solid #ccc;
//           box-sizing: border-box;
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default ProfileForm3;


"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress, Chip, Stack, Autocomplete, TextField, Checkbox, Button } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation'; // Assuming it's next/router for routing
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { pubsub } from '@/app/services/pubsub.service';
import { options } from '@/app/constants/categories';

interface ProfileForm3Props {
  onPrevious: () => void;
}

type Option = {
  label: string;
  value: string;
  children?: Option[];
};

const industryOptions = [
  "Chemicals",
  "Agriculture",
  "Electronics",
  "Energy",
  "Environmental and waste management",
  "Food and beverage",
  "Healthcare",
  "Medical devices and equipment",
  "Mining and metals",
  "Real estate and construction",
  "Textiles",
];

const ProfileForm3: React.FC<ProfileForm3Props> = ({ onPrevious }) => {
  // const ProfileForm3: React.FC = () => {
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
        await axios.post(APIS.FORM3, values);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

            <Autocomplete
              multiple
              id="categories"
              options={industryOptions}
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
              style={{ width: '45%' }}
            />

            <div className="nested-multiselect-dropdown" ref={dropdownRef} style={{ width: '50%' }}>
              <button type="button" onClick={handleToggleDropdown}>
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
            </div>


          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}> */}
          {/* <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={loading}
              loadingIndicator={<CircularProgress size={24} />}
              sx={{ mt: 2, mb: 2, ml: '90%', width: 100, borderRadius: 2 }}
              color="secondary"
            >
              Save
            </LoadingButton> */}
          <Button
            type="button"
            variant="contained"
            size="small"
            sx={{ mt: 2, mb: 2, px: 3, py: 1, marginLeft: "0.1%", top: '65px' }}
            onClick={onPrevious}
          >
            Back
          </Button>
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
            {/* </Box> */}
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
          width: 570px;
          border-radius: 20px;
          background-color:white;
          height: 57px;
          padding: 10px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
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

export default ProfileForm3;
