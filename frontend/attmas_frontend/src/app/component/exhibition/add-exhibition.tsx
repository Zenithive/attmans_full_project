'use client'
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, MenuItem } from '@mui/material';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel, Select, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { useMemo, useCallback } from 'react';
import { PubSub, pubsub } from '@/app/services/pubsub.service';
import { Industry, options, Subjects } from '@/app/constants/categories';
import SubjectMatterExpertise from '../SubjectMatterExpertise';
interface Exhibition {
    _id?: string;
    title: string;
    description: string;
    status: string;
    videoUrl: string;
    dateTime: string;
    industries: string[];
    subjects: string[];
    username: string;
}

interface AddExhibitionProps {
    // onAddExhibition: (exhibition: Exhibition) => void;
    editingExhibition?: Exhibition | null;
    onCancelEdit?: () => void;
}


const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string(),
    videoUrl: Yup.string().required('Video URL is required'),
    dateTime: Yup.date().nullable('Date & Time is required'),
    categoryforIndustries: Yup.array().of(Yup.string()),
    subject: Yup.array().of(Yup.string())
});

export const AddExhibition = ({ editingExhibition, onCancelEdit }: AddExhibitionProps) => {
    const [open, toggleDrawer] = React.useState(false);
    const [usernames, setUsernames] = React.useState<string[]>([]);

    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { userType } = userDetails;

    const initialValues = React.useMemo(() => ({
        title: '',
        description: '',
        status: '',
        videoUrl: '',
        dateTime: null as Dayjs | null,
        categoryforIndustries: [],
        subject: []
    }), []);

    React.useEffect(() => {
        if (editingExhibition) {
            toggleDrawer(true);
        }
    }, [editingExhibition]);

    React.useEffect(() => {
        // Fetch the list of usernames from the backend
        const fetchUsernames = async () => {
            try {
                const response = await axios.get(`${APIS.INNOVATORSFOREXIBITION}`);
                console.log("response", response);

                setUsernames(response.data);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        fetchUsernames();
    }, []);

    const industries = useMemo(() => Industry(), []);
    const subjects = useMemo(() => Subjects(), []);

    const allSubjectItems = useMemo(() => subjects.flatMap(subject => subject.items.map(item => ({
        category: subject.category,
        label: item
    }))), [subjects]);
    const handleSubmit =React.useCallback (async (values: { title: string; description: string; status:string;dateTime:Dayjs | null; categoryforIndustries: string[]; subject: string[];videoUrl:string; }, { setSubmitting, resetForm }: any) => {
        const exhibitionData = {
            title: values.title,
            description: values.description,
            dateTime: values.dateTime ? values.dateTime.toISOString() : null,
            status: values.status,
            videoUrl: values.videoUrl,
            industries: values.categoryforIndustries,
            subjects: values.subject,
            userId: userDetails._id,
            username: userDetails.username
        };

        console.log("wee", exhibitionData);

        try {
            if (editingExhibition) {
                await axios.put(`${APIS.EXHIBITION}/${editingExhibition._id}`, exhibitionData);
                pubsub.publish('ExhibitionUpdated', { message: 'Exhibition updated' });
                pubsub.publish('toast', { message: 'Exhibition updated successfully!', severity: 'success' });
            } else {
                await axios.post(APIS.EXHIBITION, exhibitionData);
                // onAddExhibition(response.data);
                pubsub.publish('ExhibitionCreated', { message: 'A new exhibition Created' });
                pubsub.publish('toast', { message: 'New exhibition created successfully!', severity: 'success' });
            }
            resetForm();
            toggleDrawer(false);
            onCancelEdit && onCancelEdit();
        } catch (error) {
            console.error('Error creating/updating exhibition:', error);
            pubsub.publish('toast', { message: 'Failed to create/update exhibition.', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    }, [editingExhibition, userDetails, onCancelEdit]);

    return (
        <>
            {userType === "Admin" && (
                <Button onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained' sx={{
                    borderRadius: 3, backgroundColor: '#CC4800', color: "white"
                }}>    {editingExhibition ? 'Edit Exhibition' : 'Create Exhibition'}</Button>
            )}
            <Drawer sx={{ '& .MuiDrawer-paper': { width: "50%", borderRadius: 3, pr: 10, mr: -8 } }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>
                <Box component="div" sx={{ display: "flex", justifyContent: "space-between", pl: 4 }}>
                    <h2>{editingExhibition ? 'Edit Exhibition' : 'Create Exhibition'}</h2>
                    <IconButton aria-describedby="id" onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                <Formik
                    initialValues={editingExhibition ? {
                        title: editingExhibition.title || '',
                        description: editingExhibition.description || '',
                        status: editingExhibition.status || '',
                        videoUrl: editingExhibition.videoUrl || '',
                        dateTime: editingExhibition.dateTime ? dayjs(editingExhibition.dateTime) : null,
                        categoryforIndustries: editingExhibition.industries || [],
                        subject: editingExhibition.subjects || []
                    } : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}

                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, position: "relative", left: "15px" }}>
                                <TextField
                                    label="Title"
                                    name="title"
                                    variant="outlined"
                                    color='secondary'
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
                                    color='secondary'
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
                                    label="Video Url"
                                    name="videoUrl"
                                    variant="outlined"
                                    color='secondary'
                                    value={values.videoUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    error={!!(errors.videoUrl && touched.videoUrl)}
                                    helperText={<ErrorMessage name="description" />}
                                />
                                {editingExhibition && (
                                    <FormControl fullWidth>
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            id="status"
                                            name="status"
                                            color='secondary'
                                            value={values.status}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Status"
                                        >
                                            <MenuItem value="cancel">cancel </MenuItem>
                                            <MenuItem value="open">open</MenuItem>
                                            <MenuItem value="close">close</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                                <Autocomplete
                                    multiple
                                    options={industries}
                                    value={values.categoryforIndustries}
                                    onChange={(event, value) => setFieldValue('categoryforIndustries', value)}
                                    renderTags={(value, getTagProps) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option: string, index) => (
                                                <Chip
                                                    label={option}
                                                    variant="outlined"
                                                    color='secondary'
                                                    {...getTagProps({ index })}
                                                    key={option}
                                                    onDelete={() => setFieldValue('categoryforIndustries', values.categoryforIndustries.filter((ind: string) => ind !== option))}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Preferred Industries"
                                            color='secondary'
                                            placeholder="Select industries"
                                            error={!!(errors.categoryforIndustries && touched.categoryforIndustries)}
                                            helperText={
                                                typeof errors.categoryforIndustries === 'string' && touched.categoryforIndustries
                                                    ? errors.categoryforIndustries
                                                    : undefined
                                            }

                                        />
                                    )}
                                />
                                

                                <SubjectMatterExpertise
                                    selectedValues={values.subject}
                                    setSelectedValues={(values) => setFieldValue('subject', values)}
                                    options={options} // Pass the options array here
                                    Option={[]} value={[]} onChange={function (selectedSubjects: string[]): void {
                                        throw new Error('Function not implemented.');
                                    } }                                />


                                    
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Date & Time"
                                        value={values.dateTime}
                                        onChange={(newValue) => setFieldValue('dateTime', newValue)}
                                    />
                                </LocalizationProvider>



                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>



                                    <Button variant="contained" style={{ background: "#616161", color: "white" }} onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>Cancel</Button>


                                    <Button variant="contained" color='primary' type="submit" disabled={isSubmitting} > {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (editingExhibition ? 'Edit' : 'Create')}</Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </>
    );
};
export default AddExhibition;
