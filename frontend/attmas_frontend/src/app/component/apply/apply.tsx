'use client'
import * as React from 'react';
import { Box, IconButton, Divider, Drawer, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import pubsub from '@/app/services/pubsub.service';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';

interface Apply {
  _id?: string;
  title: string;
  description: string;
  Budget: number;
  TimeFrame: string | null;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  Budget: Yup.number().required('Budget is required'),
  TimeFrame: Yup.date().nullable('Date & Time is required'),
});

interface AddApplyProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobTitle: string;
}

export const AddApply= ({ open, setOpen,jobTitle }:AddApplyProps) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const initialValues = {
    title: jobTitle,
    description: '',
    Budget: 0,
    TimeFrame: null as Dayjs | null,
  };

  const handleSubmit = async (
    values: { title: string; description: string; Budget: number; TimeFrame: Dayjs | null },
    { setSubmitting, resetForm }: any
  ) => {
    const applyData = {
      title: values.title,
      description: values.description,
      TimeFrame: values.TimeFrame ? values.TimeFrame.toISOString() : null,
      Budget: values.Budget,
      userId: userDetails._id,
    };

    try {
      await axios.post(APIS.APPLY, applyData);
      pubsub.publish('ApplyCreated', { message: 'A new Apply Created' });
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error creating apply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': { width: '50%', borderRadius: 3, pr: 10, mr: -8 } }}
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
        <h2>Create Apply</h2>
        <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ p: 0, right: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: '$5' }} />
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, position: 'relative', left: '15px' }}>
              <TextField
                label="Title"
                name="title"
                variant="outlined"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={!!(errors.title && touched.title)}
                helperText={<ErrorMessage name="title" />}
              />
              <TextField
                label="Description"
                name="description"
                variant="outlined"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={4}
                fullWidth
                error={!!(errors.description && touched.description)}
                helperText={<ErrorMessage name="description" />}
              />
              <TextField
                fullWidth
                name="Budget"
                label="BUDGET"
                type="number"
                value={values.Budget}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Budget && Boolean(errors.Budget)}
                helperText={touched.Budget && errors.Budget}
                margin="normal"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Time Frame"
                  value={values.TimeFrame}
                  onChange={(newValue) => setFieldValue('TimeFrame', newValue)}
                />
              </LocalizationProvider>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ background: '#616161', color: 'white' }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
