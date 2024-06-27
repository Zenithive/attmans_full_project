'use client';
import * as React from 'react';
import { Box, Button, CircularProgress, Drawer, IconButton, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Divider, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { SelectChangeEvent } from '@mui/material/Select';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';

interface SendInnovatorsProps {
  onCancel: () => void;
  exhibition: any;
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required('Message is required'),
  innovators: Yup.array().min(1, 'At least one innovator must be selected').required('Innovators are required'),
});

export const SendInnovators = ({ onCancel, exhibition }: SendInnovatorsProps) => {
  const [open, toggleDrawer] = React.useState(false);
  const [submittedInnovators, setSubmittedInnovators] = React.useState<{ username: string; innovators: string }[]>([]);
  

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  React.useEffect(() => {
    toggleDrawer(true);
    fetchSubmittedInnovators();
  }, []);

  const fetchSubmittedInnovators = async () => {
    try {
      const response = await axios.get(`${APIS.GET_SUBMITTED_INNOVATORS}?userId=${userDetails._id}`);
      console.log('Fetched submitted innovators:', response.data);
      setSubmittedInnovators(response.data);
    } catch (error) {
      console.error('Error fetching submitted innovators:', error);
    }
  };

  const initialValues = {
    message: '',
    innovators: [] as string[],  // Initial value for multiple innovators
  };

  const handleSubmit = async (values: { message: string; innovators: string[] }, { setSubmitting, resetForm }: any) => {
    const selectedInnovators = innovators
      .filter(innovator => values.innovators.includes(innovator.id))
      .map(innovator => innovator.name);

    const sendInnovators = {
      message: values.message,
      innovators: selectedInnovators,
      userId: userDetails._id,
      username: userDetails.username
    };

    try {
      // API call to send the message
      await axios.post(APIS.SEND_INNOVATORS, sendInnovators);
      resetForm();
      toggleDrawer(false);
      fetchSubmittedInnovators();
      onCancel();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Hardcoded list of innovators
  const innovators = [
    { id: '1', name: 'Innovator One' },
    { id: '2', name: 'Innovator Two' },
    { id: '300', name: 'Innovator Three' },
  ];

  const allInnovatorIds = innovators.map(innovator => innovator.id);

  const handleSelectAll = (event: SelectChangeEvent<string[]>, setFieldValue: (field: string, value: any) => void) => {
    const selectedValues = event.target.value as string[];
    if (selectedValues.includes('all')) {
      setFieldValue('innovators', allInnovatorIds.length === selectedValues.length - 1 ? [] : allInnovatorIds);
    } else {
      setFieldValue('innovators', selectedValues);
    }
  };

  return (
    <Drawer sx={{ '& .MuiDrawer-paper': { width: '30%', borderRadius: 3, pr: 10, mr: -8 } }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancel(); }}>
      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
        <h2>Send Exhibition to Innovators</h2>
        <IconButton aria-label="close" onClick={() => { toggleDrawer(false); onCancel(); }} sx={{ p: 0, right: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
              <FormControl variant="outlined" fullWidth error={!!(errors.innovators && touched.innovators)}>
                <InputLabel color='secondary' id="innovators-label">Select Innovators</InputLabel>
                <Select
                  labelId="innovators-label"
                  id="innovators"
                  color='secondary'
                  name="innovators"
                  multiple
                  value={values.innovators}
                  onChange={(event) => handleSelectAll(event, setFieldValue)}
                  label="Select Innovators"
                  renderValue={(selected) => (selected as string[]).map(id => innovators.find(innovator => innovator.id === id)?.name).join(', ')}
                >
                  <MenuItem value="all">
                    <Checkbox color='secondary' checked={values.innovators.length === allInnovatorIds.length} />
                    <ListItemText primary="Select All" />
                  </MenuItem>
                  {innovators.map((innovator) => (
                    <MenuItem key={innovator.id} value={innovator.id}>
                      <Checkbox color='secondary' checked={values.innovators.includes(innovator.id)} />
                      <ListItemText primary={innovator.name} />
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  <ErrorMessage name="innovators" />
                </Typography>
              </FormControl>
              <TextField
                label="Message"
                name="message"
                variant="outlined"
                color='secondary'
                fullWidth
                multiline
                rows={4}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!(errors.message && touched.message)}
                helperText={<ErrorMessage name="message" />}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" sx={{bgcolor: '#616161', ':hover': {bgcolor: '#616161'} }} onClick={() => { toggleDrawer(false); onCancel(); }}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Divider sx={{ my: '$5' }} />
      <></>
      {submittedInnovators.length > 0 && (
        <Box sx={{ mt: 4, p: 2 }}>
          <Typography variant="h5" sx={{mb:2,color:"Black",borderRadius:"15px",textAlign:"center",height:"45px",fontWeight:"bolder"}}><div style={{position:"relative",top:"7px"}}>Submitted Innovators :-</div></Typography>
            <Divider sx={{ my: '$5' }} />
          {submittedInnovators.map((innovator, index) => (
             <Card sx={{ mb: 2 }}>
              <CardContent>
            <Typography key={index} variant="body2" sx={{fontWeight:"bold"}}>Innovators :- {innovator.innovators} , User :- {innovator.username}</Typography>
            </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Drawer>
  );
};

export default SendInnovators;
