'use client'
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, MenuItem } from '@mui/material';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel, Select, TextField, Autocomplete } from '@mui/material';
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
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '@/app/constants/common.constants';
import { formatToLocal, formatToUTC } from '@/app/services/date.service';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { EXHIBITION_STATUSES } from '@/app/constants/status.constant';
import axiosInstance from '@/app/services/axios.service';
import { translationsforCreateExhibition } from '../../../../public/trancation';
interface Exhibition {
    _id?: string;
    title: string;
    description: string;
    status: string;
    videoUrl: string;
    meetingUrl: string;
    dateTime: string;
    exhbTime: string;
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
    meetingUrl: Yup.string().required('Meeting URL is required'),
    dateTime: Yup.date().nullable('Date is required'),
    exhbTime: Yup.date().nullable('Time is required'),
    categoryforIndustries: Yup.array().of(Yup.string()),
    subject: Yup.array().of(Yup.string())
});

export const AddExhibition = ({ editingExhibition, onCancelEdit }: AddExhibitionProps) => {
    const [open, toggleDrawer] = React.useState(false);
    const [usernames, setUsernames] = React.useState<string[]>([]);

    const userDetails: UserSchema = useAppSelector(selectUserSession);


  const language = userDetails.language || 'english';
  const t = translationsforCreateExhibition[language as keyof typeof translationsforCreateExhibition] || translationsforCreateExhibition.english;
    const { userType } = userDetails;

    const initialValues = React.useMemo(() => ({
        title: '',
        description: '',
        status: editingExhibition ? (editingExhibition.status || '') : EXHIBITION_STATUSES.open,
        videoUrl: '',
        meetingUrl: '',
        dateTime: null as Dayjs | null,
        exhbTime: null as Dayjs | null,
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
                const response = await axiosInstance.get(`${APIS.INNOVATORSFOREXIBITION}`);
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


    const handleSubmit = React.useCallback(async (values: { title: string; description: string; status: string; dateTime: Dayjs | null; exhbTime: Dayjs | null; categoryforIndustries: string[]; subject: string[]; videoUrl: string; meetingUrl: string }, { setSubmitting, resetForm }: any) => {
        const exhibitionData = {
            title: values.title,
            description: values.description,
            dateTime: values.dateTime ? dayjs(values.dateTime).format(DATE_FORMAT) : null,
            status: values.status,
            exhbTime: dayjs(values.exhbTime).format(TIME_FORMAT),
            videoUrl: values.videoUrl,
            meetingUrl: values.meetingUrl,
            industries: values.categoryforIndustries,
            subjects: values.subject,
            userId: userDetails._id,
            username: userDetails.username
        };

        console.log("exhibitionData", exhibitionData);

        try {
            if (editingExhibition) {
                await axiosInstance.put(`${APIS.EXHIBITION}/${editingExhibition._id}`, exhibitionData);
                pubsub.publish('ExhibitionUpdated', { message: 'Exhibition updated' });
                pubsub.publish('toast', { message: 'Exhibition updated successfully!', severity: 'success' });
            } else {
                await axiosInstance.post(APIS.EXHIBITION, exhibitionData);
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
                    ml: 3, minWidth: 150, py: 0,
                    borderRadius: 3, backgroundColor: '#CC4800',minHeight:'40px', color: "white", '@media (max-width: 767px)': {
                        position: 'relative', width: '157%'
                    }
                }}>{editingExhibition ? 'Edit Exhibition' : 'Create Exhibition'}</Button>
            )}
            <Drawer sx={{
                '& .MuiDrawer-paper': {
                    width: "50%", borderRadius: 3, pr: 10, mr: -8, '@media (max-width: 767px)': {
                        width: '116%'
                    }
                }
            }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>
                <Box component="div" sx={{ display: "flex", justifyContent: "space-between", pl: 4 }}>
                    <h2>{editingExhibition ? t.editExhibition : t.createExhibition}</h2>
                    <IconButton aria-describedby="id" onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                <Formik
                    initialValues={editingExhibition ? {
                        title: editingExhibition.title || '',
                        description: editingExhibition.description || '',
                        status: editingExhibition ? editingExhibition.status : EXHIBITION_STATUSES.open,
                        videoUrl: editingExhibition.videoUrl || '',
                        meetingUrl: editingExhibition.meetingUrl || '',
                        dateTime: editingExhibition.dateTime ? dayjs(editingExhibition.dateTime) : null,
                        exhbTime: editingExhibition.exhbTime ? dayjs(editingExhibition.exhbTime, TIME_FORMAT) : null,
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
                                    label={t.title}
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
                                    label={t.description}
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
                                    label={t.videoUrl}
                                    name="videoUrl"
                                    variant="outlined"
                                    color='secondary'
                                    value={values.videoUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    error={!!(errors.videoUrl && touched.videoUrl)}
                                    helperText={<ErrorMessage name="videoUrl" />}
                                />

                                <TextField
                                    label={t.meetingUrl}
                                    name="meetingUrl"
                                    variant="outlined"
                                    color='secondary'
                                    value={values.meetingUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    error={!!(errors.meetingUrl && touched.meetingUrl)}
                                    helperText={<ErrorMessage name="meetingUrl" />}
                                />

                                <FormControl fullWidth>
                                    <InputLabel id="status-label" color='secondary'>Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        // label={t.status}
                                        id="status"
                                        name="status"
                                        color='secondary'
                                        value={values.status}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Status"
                                    >
                                        <MenuItem value={EXHIBITION_STATUSES.open}>{EXHIBITION_STATUSES.open}</MenuItem>
                                        <MenuItem value={EXHIBITION_STATUSES.close}>{EXHIBITION_STATUSES.close}</MenuItem>
                                    </Select>
                                </FormControl>

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
                                            label={t.preferredIndustries}
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
                                    }} />



                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <DatePicker
                                            format={DATE_FORMAT}
                                            label="Date"
                                            value={values.dateTime}
                                            onChange={(newValue) => setFieldValue('dateTime', newValue)}
                                        />

                                        <TimePicker
                                            format={TIME_FORMAT}
                                            label="Select Time"
                                            value={values.exhbTime}
                                            onChange={(newValue) => setFieldValue('exhbTime', newValue)}    
                                        />
                                    </Box>
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
