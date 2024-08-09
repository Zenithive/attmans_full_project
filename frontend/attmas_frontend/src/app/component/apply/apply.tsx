'use client'
import * as React from 'react';
import { Box, IconButton, Divider, Drawer, TextField, Button, CircularProgress, FormControl, Select, MenuItem, InputAdornment, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { pubsub } from '@/app/services/pubsub.service';
import { Formik, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface AddApplyProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobTitle: string;
  jobId: string;
  onCancel?: () => void; 
}

interface FormValues {
  title: string;
  description: string;
  Budget: number;
  currency: string;
  TimeFrame: Dayjs | null;
  jobId: string;
  milestones: string[];
}



const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  Budget: Yup.number().required('Budget is required'),
  currency: Yup.string().required('Currency is required'),
  TimeFrame: Yup.date().nullable('Date & Time is required'),
  milestones: Yup.array().of(Yup.string().required('Milestone is required')).optional(),
});

export const AddApply = ({ open, setOpen, jobTitle, jobId, onCancel }: AddApplyProps) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const initialValues = {
    title: jobTitle,
    description: '',
    Budget: 0,
    currency: 'INR',
    TimeFrame: null as Dayjs | null,
    jobId: jobId,
    milestones: [] as string[]
  };

  const handleSubmit = async (
    values:FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    const applyData = {
      title: values.title,
      description: values.description,
      TimeFrame: values.TimeFrame ? values.TimeFrame.toISOString() : null,
      currency: values.currency,
      Budget: values.Budget,
      userId: userDetails._id,
      username: userDetails.username,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      jobId: values.jobId,
      milestones: values.milestones,
    };

    try {
      await axios.post(APIS.APPLY, applyData);
      pubsub.publish('ApplyCreated', { message: 'A new Apply Created' });
      pubsub.publish('toast', { message: 'Applied successfully!', severity: 'success' });
    
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error creating apply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel(); 
    setOpen(false); 
  };

  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': { width: '50%', borderRadius: 3, pr: 10, mr: -8, '@media (max-width: 767px)': { width: '116%' } } }}
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
                color='secondary'
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                disabled
                error={!!(errors.title && touched.title)}
                helperText={<ErrorMessage name="title" />}
              />
              <TextField
                label="Description"
                name="description"
                color='secondary'
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
                label="Budget"
                type="number"
                color='secondary'
                value={values.Budget}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Budget && Boolean(errors.Budget)}
                helperText={touched.Budget && errors.Budget}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormControl variant="standard">
                        <Select
                          value={values.currency}
                          onChange={(e) => {
                            const selectedCurrency = e.target.value as string;
                            setFieldValue('currency', selectedCurrency);
                          }}
                        >
                          <MenuItem value="INR">INR</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Time Frame"
                  value={values.TimeFrame}
                  slotProps={{
                    textField: {
                      color: 'secondary'
                    },
                  }}
                  onChange={(newValue) => setFieldValue('TimeFrame', newValue)}
                />
              </LocalizationProvider>
              <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                 Add Your  Milestones
                </Typography>
                <FieldArray
                  name="milestones"
                  render={(arrayHelpers) => (
                    <Box>
                      {values.milestones && values.milestones.length > 0 ? (
                        values.milestones.map((milestone, index) => (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                            <TextField
                              placeholder="Milestone..."
                              name={`milestones[${index}]`}
                              value={milestone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              error={touched.milestones && Boolean(errors.milestones)}
                              helperText={touched.milestones && errors.milestones}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <IconButton
                                onClick={() => arrayHelpers.remove(index)}
                                aria-label="remove milestone"
                                 color= 'secondary'
                                disabled={values.milestones.length === 0}
                                sx={{ padding: '5px 10px', margin: 0 }}
                              >
                                <RemoveIcon sx={{ fontSize: 'small' }} />
                                <span style={{ fontSize: 'small', marginLeft: '5px' }}>Remove Milestone</span>
                              </IconButton>
                            </Box>
                          </Box>
                        ))
                      ) : null}
                      <Button
                        onClick={() => arrayHelpers.push('')}
                        variant="outlined"
                        sx={{ mt: 1, textTransform: 'none' }}
                        startIcon={<AddIcon />}
                      >
                        Add Milestone
                      </Button>
                    </Box>
                  )}
                />
              </Paper>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" sx={{ bgcolor: '#616161', ':hover': { bgcolor: '#616161' } }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
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
