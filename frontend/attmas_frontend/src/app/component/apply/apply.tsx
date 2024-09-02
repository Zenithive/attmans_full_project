'use client'
import * as React from 'react';
import { Box, IconButton, Divider, Drawer, TextField, Button, CircularProgress, FormControl, Select, MenuItem, InputAdornment, Paper, Typography, Tooltip, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants, Grid } from '@mui/material';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { DATE_FORMAT } from '@/app/constants/common.constants';

interface AddApplyProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobTitle: string;
  jobId: string;
  onCancel?: () => void;
}

interface Milestone {
  scopeOfWork: string;
  milestones: {
    name: {
      text: string;
      timeFrame: string | null;
    };
  }[];
}

interface FormValues {
  title: string;
  description: string;
  Budget: number;
  currency: string;
  TimeFrame: Dayjs | null;
  jobId: string;
  availableSolution: string;
  SolutionUSP: string;
  milestones: Milestone[];
  applyType: string;
}



const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  Budget: Yup.number().required('Budget is required'),
  currency: Yup.string().required('Currency is required'),
  TimeFrame: Yup.date().nullable('Date & Time is required'),
  availableSolution: Yup.string().required('You have to give solution'),
  SolutionUSP: Yup.string().required('Solution USP is required'),
  milestones: Yup.array().of(
    Yup.object().shape({
      scopeOfWork: Yup.string().required('Scope of work is required'),
      milestones: Yup.array().of(
        Yup.object().shape({
          name: Yup.object().shape({
            text: Yup.string().required('Milestone text is required'),
            timeFrame: Yup.date().nullable().required('Milestone time frame is required'),
          }),
        })
      ).min(1, 'At least one milestone is required')
    })
  ).min(1, 'At least one milestone group is required'),
});


export const AddApply = ({ open, setOpen, jobTitle, jobId, onCancel }: AddApplyProps) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const initialValues = {
    title: jobTitle,
    description: '',
    Budget: 0,
    currency: 'INR',
    TimeFrame: null as Dayjs | null,
    jobId: jobId,
    milestones: [{
      scopeOfWork: '',
      milestones: [{ name: { text: '', timeFrame: null } }],

    }],
    availableSolution: '',
    SolutionUSP: '',
    applyType: 'freelancerApply',
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
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
        availableSolution: values.availableSolution,
        SolutionUSP: values.SolutionUSP,
        applyType: 'FreelancerApply',
      };

      const applyResponse = await axios.post(APIS.APPLY, applyData);
      const applyId = applyResponse.data._id;

      const milestonePromises = values.milestones.map(milestone => {
        const formattedMilestone = {
          scopeOfWork: milestone.scopeOfWork,
          milestones: milestone.milestones.map(milestoneItem => ({
            name: milestoneItem.name,
          })),
          userId: userDetails._id,
          jobId: values.jobId,
          applyId: applyId,
        };

        return axios.post(APIS.MILESTONES, formattedMilestone);
      });

      await Promise.all(milestonePromises);

      pubsub.publish('ApplyCreated', { message: 'A new Apply Created' });
      pubsub.publish('toast', { message: 'Applied successfully!', severity: 'success' });

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error creating apply:', error);
      setFetchError('An error occurred while creating the apply.');
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
      onClose={() => handleCancel}
    >
      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
        <h2>Apply</h2>
        <IconButton aria-label="close" onClick={handleCancel} sx={{ p: 0, right: 0 }}>
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
              <DatePicker
                  format={DATE_FORMAT}
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

              <FieldArray
                name="milestones"
                render={(arrayHelpers) => (
                  <Box>
                    {values.milestones.map((milestoneGroup, index) => (
                      <Paper key={index} elevation={3} sx={{ p: 2, mt: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ marginBottom: '40px' }}>
                          Scope of Work
                        </Typography>

                        <Typography variant="h6" sx={{ marginBottom: '20px', fontSize: 'small' }}>
                          Add Specific activities, deliverables, timelines, and/or quality guidelines to ensure successful execution of the project.
                        </Typography>
                        <TextField
                          label="Scope of Work"
                          name={`milestones[${index}].scopeOfWork`}
                          value={milestoneGroup.scopeOfWork}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color='secondary'
                          multiline
                          sx={{ marginBottom: '40px' }}
                          rows={4}
                          fullWidth
                          error={!!(errors.milestones && touched.milestones)}
                          helperText={<ErrorMessage name={`milestones[${index}].scopeOfWork`} />}
                        />

                        <Typography variant="h6" sx={{ marginBottom: '20px', fontSize: 'small' }}>
                          Add milestones to help you break up the scope of work into smaller deliverables to track the project's progress. These can be viewed and modified by the client.
                        </Typography>
                        <FieldArray
                          name={`milestones[${index}].milestones`}
                          render={(milestoneArrayHelpers) => (
                            <Box>
                              {milestoneGroup.milestones.map((milestone, milestoneIndex) => (
                                <Grid
                                  container
                                  spacing={2}
                                  key={milestoneIndex}
                                  sx={{ marginBottom: '20px', alignItems: 'center' }}
                                >
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      placeholder="Milestone..."
                                      name={`milestones[${index}].milestones[${milestoneIndex}].name.text`}
                                      value={milestone.name.text}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      multiline
                                      error={!!(errors.milestones && touched.milestones)}
                                      helperText={<ErrorMessage name={`milestones[${index}].milestones[${milestoneIndex}].name.text`} />}
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={5}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format={DATE_FORMAT}
                                        label="Milestone Deadline Date"
                                        value={milestone.name.timeFrame ? dayjs(milestone.name.timeFrame) : null}
                                        onChange={(newValue) =>
                                          setFieldValue(`milestones[${index}].milestones[${milestoneIndex}].name.timeFrame`, newValue)
                                        }
                                        slotProps={{
                                          textField: {
                                            color: 'secondary',
                                          },
                                        }}
                                      />
                                    </LocalizationProvider>
                                  </Grid>

                                  {milestoneIndex > 0 && (
                                    <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                      <IconButton
                                        onClick={() => milestoneArrayHelpers.remove(milestoneIndex)}
                                        color="secondary"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  )}
                                </Grid>
                              ))}

                              <Button
                                onClick={() => milestoneArrayHelpers.push({  name: { text: '', timeFrame: null }, })}
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
                    ))}
                  </Box>
                )}
              />



              <Typography variant="h6" sx={{ fontSize: 'small' }}>
                What have been the flaws in current solution?*
              </Typography >
              <TextField
                placeholder="Write about other available solutions"
                name='availableSolution'
                value={values.availableSolution}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={4}
                sx={{ marginBottom: '20px' }}
                fullWidth
                error={!!(errors.availableSolution && touched.availableSolution)}
                helperText={<ErrorMessage name="availableSolution" />}
              />


              <Typography variant="h6" sx={{ fontSize: 'medium' }}>
                Positive and unique results do we expect to see from your solution?*
              </Typography >
              <TextField
                placeholder="Write your solution USP here"
                name='SolutionUSP'
                value={values.SolutionUSP}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={5}
                fullWidth
                error={!!(errors.SolutionUSP && touched.SolutionUSP)}
                helperText={<ErrorMessage name="SolutionUSP" />}
              />

              <Typography
                variant="body2"
                align="center"
                mt={4}
                mb={3}
                sx={{ color: 'red', fontStyle: 'italic', fontWeight: 'bold' }}
              >
                Please Note: <br />
                If you have a granted patent or publish patent application, please give a link in the "Share Solution" section above. <br />
                Please provide ONLY NON-CONFIDENTIAL information. Do NOT provide ANYTHING that is PROPRIETARY and CONFIDENTIAL.
              </Typography>


              {fetchError && (
                <Typography color="error" align="center" mt={2}>
                  {fetchError}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" sx={{ bgcolor: '#616161', ':hover': { bgcolor: '#616161' } }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Apply'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
