import React from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { categories } from '@/app/constants/categories';
import { FormikProps } from 'formik';
import { FormValues } from '../filter/filter.component';

interface CategoryFilterProps {
    formikObj: FormikProps<FormValues>;
    keyToMap: string;
}

const CategoryComponent: React.FC<CategoryFilterProps> = ({ formikObj, keyToMap }) => {

    const handleCategoryCheckboxChange = (value: string, isChecked: boolean) => {
        const tmpFormValues: Array<string> = Array.isArray(formikObj.values[keyToMap]) ? formikObj.values[keyToMap] as Array<string> : [];
        let updatedCategories = [...tmpFormValues];
        if (isChecked) {
            updatedCategories.push(value);
        } else {
            updatedCategories = updatedCategories.filter(v => v !== value);
        }
        formikObj.setFieldValue(keyToMap, updatedCategories);
    };

    return (
        <Autocomplete
            multiple
            id="categories"
            options={categories}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            value={(formikObj.values[keyToMap] || []) as Array<string>}
            onChange={(event, newValue) => formikObj.setFieldValue(keyToMap, newValue)}
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
            size='small'
            sx={{ display: 'inline-flex', marginBottom: { xs: 2, md: 0 }, mr: 2, minWidth: 200 }}
        />
    );
};

export default CategoryComponent;
