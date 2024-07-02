import * as React from 'react';
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, Drawer, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { pubsub } from '@/app/services/pubsub.service';

interface SendInnovatorsProps {
  onCancel: () => void;
  exhibition: any;
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required('Message is required'),
  innovators: Yup.array().min(1, 'At least one innovator must be selected').required('Innovators are required'),
});

export const SendInnovators = ({ onCancel }: SendInnovatorsProps) => {
  const [open, setOpen] = React.useState(false);
  const [submittedInnovators, setSubmittedInnovators] = React.useState<{ username: string; innovators: string }[]>([]);
  const [innovators, setInnovators] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  React.useEffect(() => {
    setOpen(true);
    fetchSubmittedInnovators();
    fetchInnovators(page);
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

  const fetchInnovators = async (page: number, query: string = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${APIS.GET_INNOVATORS}&page=${page}&limit=10&search=${query}`);
      console.log('Fetched innovators:', response.data);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        const formattedInnovators = response.data.map((innov: any) => ({
          id: innov.username,
          name: `${innov.firstName} ${innov.lastName}`,
        }));
        const arrayOfObjects = [...innovators, ...formattedInnovators];
        const uniqueObjects = Array.from(new Set(arrayOfObjects.map(obj => obj.id)))
          .map(id => {
            return arrayOfObjects.find(obj => obj.id === id);
          });

        setInnovators(uniqueObjects);
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching innovators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const bottom = event.currentTarget.scrollHeight - event.currentTarget.scrollTop === event.currentTarget.clientHeight;
    if (bottom && hasMore && !loading) {
      fetchInnovators(page + 1, searchQuery);
    }
  };

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    // setSearchQuery(query);  // Update search query state
    setPage(1);
    // setInnovators([]);
    setHasMore(true);
    // await fetchInnovators(1, query);
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
      username: userDetails.username,
    };

    try {
      // API call to send the message
      await axios.post(APIS.SEND_INNOVATORS, sendInnovators);
      pubsub.publish('toast', { message: 'Exhibition sent successfully!', severity: 'success' });
      resetForm();
      setOpen(false);
      fetchSubmittedInnovators();
      onCancel();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const allInnovatorIds = innovators.map(innovator => innovator.id);

  const handleSelectAll = (event: React.ChangeEvent<{}>, value: string[], setFieldValue: (field: string, value: any) => void) => {
    if (value.includes('all')) {
      setFieldValue('innovators', allInnovatorIds.length === value.length - 1 ? [] : allInnovatorIds);
    } else {
      setFieldValue('innovators', value);
    }
  };

  return (
    <Drawer sx={{ '& .MuiDrawer-paper': { width: '30%', borderRadius: 3, pr: 10, mr: -8 } }} anchor="right" open={open} onClose={() => { setOpen(false); onCancel(); }}>
      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
        <h2>Send Exhibition to Innovators</h2>
        <IconButton aria-label="close" onClick={() => { setOpen(false); onCancel(); }} sx={{ p: 0, right: 0 }}>
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
              <Autocomplete
                multiple
                id="innovators"
                options={innovators}
                disableCloseOnSelect
                getOptionLabel={(option: { id: string; name: string } | undefined) => option ? option.name : ''}
                value={values.innovators.map(id => innovators.find(innovator => innovator.id === id))}
                onChange={(event, value) => setFieldValue('innovators', value.map(innovator => innovator?.id))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Innovators"
                    value={searchQuery} // Set the value to the searchQuery state
                    color="secondary"
                    onChange={handleSearchChange} // Attach the search handler
                    error={!!(errors.innovators && touched.innovators)}
                    helperText={<ErrorMessage name="innovators" />}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      color='secondary'
                      checked={selected}
                    />
                    <Typography variant="body1">{option?.name}</Typography>
                  </li>
                )}
                ListboxProps={{
                  onScroll: handleScroll, // Attach handleScroll to handle infinite scroll
                }}
              />
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
                <Button variant="contained" sx={{ bgcolor: '#616161', ':hover': { bgcolor: '#616161' } }} onClick={() => { setOpen(false); onCancel(); }}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : userDetails.userType === 'Admin' ? 'Invite' : 'Participate'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Box sx={{ mt: 4, p: 2 }}>
        {submittedInnovators.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: "Black", borderRadius: "15px", textAlign: "center", height: "45px", fontWeight: "bolder" }}>
              <div style={{ position: "relative", top: "7px" }}>Submitted Innovators :-</div>
            </Typography>
            {submittedInnovators.map((innovator, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>Innovators: {innovator.innovators}, User: {innovator.username}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SendInnovators;
