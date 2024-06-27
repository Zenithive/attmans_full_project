"use client"
import React from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Chip,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { FormikProps } from 'formik';
import { categories, subcategories } from '@/app/constants/categories';

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

interface CommonProfileFieldsProps {
  formik: FormikProps<any>;
  selectedCategories: string[];
  selectedSubcategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedSubcategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({
  formik,
  selectedCategories,
  selectedSubcategories,
  setSelectedCategories,
  setSelectedSubcategories,
}) => {
  const { setFieldValue } = formik;

  const handleCategoryChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    setSelectedSubcategories([]);
    setFieldValue('categories', value);
    setFieldValue('subcategories', []);
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<typeof selectedSubcategories>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubcategories(typeof value === 'string' ? value.split(',') : value);
    setFieldValue('subcategories', value);
  };

  const handleDeleteCategory = (category: string) => () => {
    const newSelectedCategories = selectedCategories.filter((cat) => cat !== category);
    setSelectedCategories(newSelectedCategories);
    setFieldValue('categories', newSelectedCategories);
    setSelectedSubcategories([]);
    setFieldValue('subcategories', []);
  };

  const handleDeleteSubcategory = (subcategory: string) => () => {
    const newSelectedSubcategories = selectedSubcategories.filter((subcat) => subcat !== subcategory);
    setSelectedSubcategories(newSelectedSubcategories);
    setFieldValue('subcategories', newSelectedSubcategories);
  };

  return (
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
                    onDelete={handleDeleteCategory(value)}
                    onMouseDown={(event) => event.stopPropagation()}
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
                      onDelete={handleDeleteSubcategory(value)}
                      onMouseDown={(event) => event.stopPropagation()}
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
  );
};

export default CommonProfileFields;
