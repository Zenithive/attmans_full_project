"use client"
import React, { useState } from 'react';
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
import { FormikProps } from 'formik';
import { subcategories, Subcategory } from '@/app/constants/categories';

interface CommonProfileFieldsProps {
  formik: FormikProps<any>;
  selectedSubcategories: string[];
  setSelectedSubcategories: React.Dispatch<React.SetStateAction<string[]>>;
}

// const renderMenuItems = (subcategories: Subcategory[], selectedSubcategories: string[], handleChange: (event: SelectChangeEvent<string[]>) => void) => {
//   return subcategories.map((subcategory) => (
//     <MenuItem key={subcategory.name} value={subcategory.name}>
//       <Checkbox checked={selectedSubcategories.indexOf(subcategory.name) > -1} />
//       <ListItemText primary={subcategory.name} />
//       {subcategory.subcategories && (
//         <Select
//           multiple
//           value={selectedSubcategories}
//           onChange={handleChange}
//           renderValue={() => null}
//           input={<OutlinedInput />}
//           MenuProps={{ PaperProps: { style: { maxHeight: 400, overflowY: 'auto' } } }}
//         >
//           {renderMenuItems(subcategory.subcategories, selectedSubcategories, handleChange)}
//         </Select>
//       )}
//     </MenuItem>
//   ));
// };

const renderMenuItems = (subcategories: Subcategory[], selectedSubcategories: string[], handleChange: (event: SelectChangeEvent<string[]>) => void) => {
  return subcategories.map((subcategory) => (
    <MenuItem key={subcategory.name} value={subcategory.name}>
      <Checkbox
      color='secondary'
      checked={selectedSubcategories.indexOf(subcategory.name) > -1} />
      <ListItemText primary={subcategory.name} />
      {subcategory.subcategories && (
        <Select
          multiple
          value={selectedSubcategories}
          onChange={handleChange}
          renderValue={() => null}
          input={<OutlinedInput />}
          MenuProps={{ PaperProps: { style: { maxHeight: 400, overflowY: 'auto' } } }}
        >
          {renderMenuItems(subcategory.subcategories, selectedSubcategories, handleChange)}
        </Select>
      )}
    </MenuItem>
  ));
};
const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({
  formik,
  selectedSubcategories,
  setSelectedSubcategories,
}) => {
  const { setFieldValue } = formik;

  const handleSubcategoryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newSelectedSubcategories = typeof value === 'string' ? value.split(',') : value;
    setSelectedSubcategories(newSelectedSubcategories);
    setFieldValue('subcategories', newSelectedSubcategories);
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
            {renderMenuItems(subcategories, selectedSubcategories, handleSubcategoryChange)}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default CommonProfileFields;
