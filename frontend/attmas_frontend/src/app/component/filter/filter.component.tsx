"use client";
import * as React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Button, ButtonGroup, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ClearIcon from '@mui/icons-material/Clear';
import { Form, Formik, FormikProps, useFormik } from 'formik';
import { getParamFromFilterArray } from '@/app/services/common.service';
import CategoryComponent from '../EditProfileComponents/category.component';
import SubjectMatterExpertise from '../SubjectMatterExpertise';
import { options } from '@/app/constants/categories';

export interface FilterColumn {
  name: string;
  value: string;
  key: string;
  type: string;
}

interface NewFilterColumn extends FilterColumn {
  active: boolean;
}

interface FiltersProps {
  column: Array<FilterColumn>
  onFilter: CallableFunction;
}

export interface FormValues {
  [key: string]: string | Array<string>;
}


const Filters = ({ column, onFilter }: FiltersProps) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isAnyFilterSelected, setIsAnyFilterSelected] = React.useState(false);
  const [newColumn, setNewColumn] = React.useState(column as Array<NewFilterColumn>);
  const [initialValues, setInitalValues] = React.useState({});

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (event: any, Item: FilterColumn) => {
    setIsAnyFilterSelected(false);
    setNewColumn((prevItems) =>
      prevItems.map((elem) => {
        if (typeof elem?.active == undefined) elem.active = false;
        const newElem = elem.name === Item.name ? { ...elem, active: !elem.active } : elem
        if (newElem.active) {
          setIsAnyFilterSelected(true);
        }

        return newElem;
      }
      )
    );

    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFilterDom = (
    item: NewFilterColumn,
    formikObj: FormikProps<FormValues>
  ) => {
    if (item.type === 'Texbox') {
      return TextFieldFilter(item, formikObj);
    } else if (item.type === 'Category') {
      return <CategoryComponent key={item.key} keyToMap={item.key} formikObj={formikObj}></CategoryComponent>;
    } else if (item.type === 'SubCategory') {
      return (
        <>
          <Box sx={{display: 'inline-flex', mr: 2}} id="subjectMatterExpBox">
            <SubjectMatterExpertise
              selectedValues={(formikObj.values[item.key] || []) as Array<string> }
              setSelectedValues={(values) => {
                formikObj.setFieldValue(item.key, values);
              }}
              options={options} Option={[]} value={[]} onChange={function (selectedSubjects: string[]): void {
                throw new Error('Function not implemented.');
              }} />
          </Box>
        </>
      )
    }
  }

  const TextFieldFilter = (item: NewFilterColumn,
    formikObj: FormikProps<FormValues>) => {

    return (<TextField
      key={item.key}
      name={item.key}
      color='secondary'
      label={item.name}
      size="small"
      sx={{ mr: 2, mb: 2 }}
      onChange={formikObj.handleChange}
      onBlur={formikObj.handleBlur}
      value={formikObj.values[item.key]}
    />);
  }

  const onFilterSubmit = (values: FormValues) => {
    console.log(values)
    const paramString = getParamFromFilterArray(values);
    console.log(paramString)
    onFilter(paramString);
  }

  const clearFilters = () => {
    setIsAnyFilterSelected(false);
    setNewColumn((prevItems) =>
      prevItems.map((elem) => {
        return { ...elem, active: false };
      }
      )
    );

    onFilter("");
  }

  React.useEffect(() => {
    getInitialValues();
  }, [newColumn])

  const getInitialValues = () => {
    const tmpValues = newColumn.filter(elem => elem.active).reduce((acc, field) => {
      return { ...acc, [field.key]: field.type === 'Category' ? [] : '' };
    }, {});

    setInitalValues(tmpValues);
  }


  return (
    <Box component="div" sx={{ display: 'flex', width: '100%', pl: '30px' }}>

      <Box component="div" sx={{ width: '95%', display: 'flex', justifyContent: 'flex-end', padding: '0 20px 0 0', minWidth: 300 }}>
        {isAnyFilterSelected ? <Formik initialValues={initialValues} onSubmit={onFilterSubmit}>

          {(formikObj) => (
            <Form onSubmit={formikObj.handleSubmit}>
              {newColumn.map((colm, ind) => (
                <React.Fragment key={ind}>
                  {colm?.active ? getFilterDom(colm, formikObj) : ""}
                </React.Fragment>
              ))}
              <ButtonGroup
                sx={{ mt: 0.8 }}
                size='small'
                variant="contained"
                aria-label="Button group with a nested menu"
              >
                <Button type="submit" color="primary">Filter</Button>
                <Button
                  title='Clear Filters'
                  size="small"
                  onClick={clearFilters}
                >
                  <ClearIcon sx={{ fontSize: 18, fontWeight: "bolder" }} />
                </Button>
              </ButtonGroup>
            </Form>
          )}



        </Formik> : ''}
      </Box>

      <Box component="div" sx={{ width: '5%' }}>
        <IconButton onClick={handleClick}>
          <FilterAltIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {newColumn.map((col, index) => (
            <MenuItem onClick={(event) => handleMenuClick(event, col)} key={index} sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}>
              {col.name}
              {col.active ? <CheckBoxIcon fontSize="small" color="secondary" /> : ''}
            </MenuItem>
          ))}
          {/* <MenuItem onClick={handleClose}>Option 2</MenuItem>
          <MenuItem onClick={handleClose}>Option 3</MenuItem> */}
        </Menu>
      </Box>
    </Box>
  );
};

export default Filters;
