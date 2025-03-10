'use client'
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, InputAdornment, MenuItem } from '@mui/material';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel, Select, TextField, Autocomplete } from '@mui/material';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { pubsub } from '@/app/services/pubsub.service';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { useCallback, useMemo } from 'react';
import { Category, options, Subcategorys } from '@/app/constants/categories';
import SubjectMatterExpertise from '../SubjectMatterExpertise';
import { DatePicker } from '@mui/x-date-pickers';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import axiosInstance from '@/app/services/axios.service';
import { translationsforProject } from '../../../../public/trancation';



interface Jobs {
    Sector: string;
    Quantity: number;
    ProductDescription: string;
    DetailsOfInnovationChallenge: string;
    _id?: string;
    title: string;
    description: string;
    username: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
    SelectService: string;
    Objective: string;
    Expectedoutcomes: string;
    IPRownership: string;
    currency: string;
}

interface AddJobsProps {
    editingJobs?: Jobs | null;
    onCancelEdit?: () => void;
}


// const validationSchema = Yup.object().shape({
//     title: Yup.string().required('Title is required'),
//     description: Yup.string().required('Description is required'),
//     // SelectService: Yup.array().of(Yup.string()).required('Select Service is required'),
//     DetailsOfInnovationChallenge: Yup.string(),
//     ProductDescription: Yup.string(),
//     Quantity: Yup.number(),
//     Sector: Yup.string(),
//     Expertiselevel: Yup.string(),
//     Objective: Yup.string().required('Objective is required'),
//     IPRownership: Yup.string().required('IPR ownership is required'),
//     Expectedoutcomes: Yup.string().required('Expected outcomes are required'),
//     Budget: Yup.number().required('Budget is required'),
//     TimeFrame: Yup.date().nullable().required('Date & Time are required'),
//     categoryforCategory: Yup.array().of(Yup.string()),
//     Subcategory: Yup.array().of(Yup.string()),
//     currency: Yup.string().required('Currency is required')
// });

export const AddProjects = ({ editingJobs, onCancelEdit }: AddJobsProps) => {
    const [open, toggleDrawer] = React.useState(false);
    const [currency, setCurrency] = React.useState('INR');



    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const language = userDetails.language || 'english';
    const t = translationsforProject[language as keyof typeof translationsforProject] || translationsforProject.english;
  

    const initialValues = React.useMemo(() => ({
        title: '',
        description: '',
        SelectService: '',
        Expertiselevel: '',
        Budget: 0,
        Expectedoutcomes: '',
        TimeFrame: null as Dayjs | null,
        categoryforCategory: [],
        Subcategory: [],
        Objective: '',
        IPRownership: '',
        DetailsOfInnovationChallenge: '',
        Sector: '',
        Quantity: 0,
        username: userDetails.username,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        ProductDescription: '',
        currency: 'INR',

    }), [userDetails]);

    React.useEffect(() => {
        if (editingJobs) {
            toggleDrawer(true);
        }
    }, [editingJobs]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t.titleRequired),
        description: Yup.string().required(t.descriptionRequired),
        DetailsOfInnovationChallenge: Yup.string(),
        ProductDescription: Yup.string(),
        Quantity: Yup.number(),
        Sector: Yup.string(),
        Expertiselevel: Yup.string(),
        Objective: Yup.string().required(t.objectiveRequired),
        IPRownership: Yup.string().required(t.iprOwnershipRequired),
        Expectedoutcomes: Yup.string().required(t.expectedOutcomesRequired),
        Budget: Yup.number().required(t.budgetRequired),
        TimeFrame: Yup.date().nullable().required(t.timeFrameRequired),
        categoryforCategory: Yup.array().of(Yup.string()),
        Subcategory: Yup.array().of(Yup.string()),
        currency: Yup.string().required(t.currencyRequired)
      });
      

    const handleSubmit = React.useCallback(async (values: { title: string; description: string; SelectService: string; DetailsOfInnovationChallenge: string; Sector: string; ProductDescription: string; Quantity: number; Expertiselevel: string; Budget: number, TimeFrame: Dayjs | null; categoryforCategory: string[]; Subcategory: string[]; Objective: string; Expectedoutcomes: string, IPRownership: string; currency: string; }, { setSubmitting, resetForm }: any) => {
        const jobsData = {
            title: values.title,
            description: values.description,
            SelectService: values.SelectService,
            TimeFrame: values.TimeFrame ? values.TimeFrame.toISOString() : null,
            Expertiselevel: values.Expertiselevel,
            Budget: values.Budget,
            Category: values.categoryforCategory,
            Subcategorys: values.Subcategory,
            DetailsOfInnovationChallenge: values.DetailsOfInnovationChallenge,
            Sector: values.Sector,
            Quantity: values.Quantity,
            ProductDescription: values.ProductDescription,
            Objective: values.Objective,
            Expectedoutcomes: values.Expectedoutcomes,
            IPRownership: values.IPRownership,
            userId: userDetails._id,
            username: userDetails.username,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            currency: values.currency,
        };

        try {
            if (editingJobs) {
                console.log('Updating job with id:', editingJobs._id, jobsData);
                await axiosInstance.put(`${APIS.JOBS}/${editingJobs._id}`, jobsData);
                pubsub.publish('JobUpdated', { message: 'Jobs updated' });
                pubsub.publish('toast', { message: 'Edit Project successfully!', severity: 'success' });

            } else {
                await axiosInstance.post(APIS.JOBS, jobsData);
                //onAddJobs(response.data);
                pubsub.publish('JobCreated', { message: 'A new Job Created' });
                pubsub.publish('toast', { message: 'Create Project successfully!', severity: 'success' });

            }
            resetForm();
            toggleDrawer(false);
            onCancelEdit && onCancelEdit();
        } catch (error) {
            console.error('Error creating/updating jobs:', error);
        } finally {
            setSubmitting(false);
        }
    }, [editingJobs, userDetails, onCancelEdit]);


    return (
        <>
            {userDetails.userType === 'Project Owner' && (
                <Button sx={{ ml: 3, minWidth: 150, pt: 0,minHeight:'40px' }} onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained'>{editingJobs ? 'Edit Project' : 'Create Project'}</Button>
            )}
            <Drawer sx={{
                '& .MuiDrawer-paper': {
                    width: "50%", borderRadius: 3, pr: 10, mr: -8, '@media (max-width: 767px)': {
                        width: '116%'
                    }
                }
            }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>
                <Box component="div" sx={{ display: "flex", justifyContent: "space-between", pl: 4 }}>
                    <h2> {editingJobs ? 'Edit Project' : 'Create Project'}</h2>
                    <IconButton aria-describedby="id" onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                <Formik
                    initialValues={editingJobs ? {
                        title: editingJobs.title || '',
                        description: editingJobs.description || '',
                        SelectService: editingJobs.SelectService || '',
                        Expertiselevel: editingJobs.Expertiselevel || '',
                        Budget: editingJobs.Budget || 0,
                        TimeFrame: editingJobs.TimeFrame ? dayjs(editingJobs.TimeFrame) : null,
                        categoryforCategory: editingJobs.Category || [],
                        Subcategory: editingJobs.Subcategorys || [],
                        DetailsOfInnovationChallenge: editingJobs.DetailsOfInnovationChallenge || '',
                        Sector: editingJobs.Sector || '',
                        Quantity: editingJobs.Quantity || 0,
                        ProductDescription: editingJobs.ProductDescription || "",
                        Expectedoutcomes: editingJobs.Expectedoutcomes || '',
                        Objective: editingJobs.Objective || '',
                        IPRownership: editingJobs.IPRownership || '',
                        currency: editingJobs.currency || '',
                    } : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, position: "relative", left: "15px" }}>
                                <TextField
                                    label={t.title}
                                    color='secondary'
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
                                    label={t.description}
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
                                <FormControl fullWidth>
                                    <InputLabel color='secondary' id="SelectService-label">Select Service</InputLabel>
                                    <Select
                                        labelId="SelectService-label"
                                        color='secondary'
                                        id="SelectService"
                                        name="SelectService"
                                        value={values.SelectService}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label={t.selectservice}
                                    >
                                        <MenuItem value="Outsource Research and Development ">Outsource Research and Development  </MenuItem>
                                        <MenuItem value="Innovative product">Innovative product</MenuItem>
                                    </Select>
                                    {values.SelectService === 'Innovative product' && (

                                        <Box sx={{ padding: 2 }}>

                                            <Box style={{ padding: 4 }}>
                                                <Box sx={{ mb: 2 }}>

                                                    <TextField
                                                        label={t.detailsOfInnovationChallenge}
                                                        name="DetailsOfInnovationChallenge"
                                                        color='secondary'
                                                        multiline
                                                        variant="outlined"
                                                        value={values.DetailsOfInnovationChallenge}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!(errors.DetailsOfInnovationChallenge && touched.DetailsOfInnovationChallenge)}
                                                        helperText={<ErrorMessage name="DetailsOfInnovationChallenge" />}
                                                    />
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <TextField
                                                        label={t.sector}
                                                        name="Sector"
                                                        color='secondary'
                                                        variant="outlined"
                                                        value={values.Sector}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!(errors.Sector && touched.Sector)}
                                                        helperText={<ErrorMessage name="Sector" />}
                                                    />
                                                </Box>

                                                <Box sx={{ mb: 2 }}>

                                                   
                                                    <TextField
                                                        label={t.quantity} // Changed from "Area of Product" to "Quantity"
                                                        name="Quantity"
                                                        color="secondary"
                                                        type="number" // Ensures the input is a number
                                                        variant="outlined"
                                                        value={values.Quantity}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!(errors.Quantity && touched.Quantity)}
                                                        helperText={<ErrorMessage name="Quantity" />}
                                                    />
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <TextField
                                                        label={t.productDescription}
                                                        name="ProductDescription"
                                                        multiline
                                                        color='secondary'
                                                        variant="outlined"
                                                        value={values.ProductDescription}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!(errors.ProductDescription && touched.ProductDescription)}
                                                        helperText={<ErrorMessage name="ProductDescription" />}
                                                    />

                                                </Box>
                                            </Box>
                                        </Box>

                                    )}
                                </FormControl>

                                {values.SelectService !== 'Innovative product' && (
                                    <FormControl fullWidth>
                                        <InputLabel color='secondary' id="Expertiselevel-label">Expertise Level</InputLabel>
                                        <Select
                                            labelId="Expertiselevel-label"
                                            color='secondary'
                                            id="Expertiselevel"
                                            name="Expertiselevel"
                                            value={values.Expertiselevel}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label={t.expertiseLevel}
                                        >
                                            <MenuItem value="Beginner">Beginner </MenuItem>
                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                            <MenuItem value="Expert">Expert</MenuItem>
                                            <MenuItem value="PhD">PhD</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}

                                <Box display="flex" alignItems="center" gap={2}>
                                    <TextField
                                        fullWidth
                                        id="Budget"
                                        name="Budget"
                                        label={t.budget}
                                        type="number"
                                        color='secondary'
                                        value={values.Budget}
                                        onChange={handleChange}
                                        error={touched.Budget && Boolean(errors.Budget)}
                                        helperText={touched.Budget && errors.Budget}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FormControl variant="standard">
                                                        <Select
                                                            value={currency}
                                                            onChange={(e) => {
                                                                const selectedCurrency = e.target.value as string;
                                                                setCurrency(selectedCurrency);
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
                                </Box>


                                <Autocomplete
                                    multiple
                                    options={Category()}
                                    value={values.categoryforCategory}

                                    onChange={(event, value) => setFieldValue('categoryforCategory', value)}
                                    renderTags={(value, getTagProps) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option: string, index) => (
                                                <Chip
                                                    label={option}
                                                    color='secondary'
                                                    {...getTagProps({ index })}
                                                    key={option}
                                                    onDelete={() => setFieldValue('categoryforCategory', values.categoryforCategory.filter((ind: string) => ind !== option))}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label={t.preferredCategory}
                                            color='secondary'
                                            placeholder="Select Category"
                                            error={!!(errors.categoryforCategory && touched.categoryforCategory)}
                                            helperText={
                                                typeof errors.categoryforCategory === 'string' && touched.categoryforCategory
                                                    ? errors.categoryforCategory
                                                    : undefined
                                            }

                                        />
                                    )}
                                />



                                <SubjectMatterExpertise
                                    selectedValues={values.Subcategory}
                                    setSelectedValues={(val) => setFieldValue('Subcategory', val)}
                                    options={options} // Pass the options array here
                                    Option={[]} value={[]} onChange={function (selectedSubjects: string[]): void {
                                        throw new Error('Function not implemented.');
                                    }} />

                                <TextField
                                    label={t.objective}
                                    name="Objective"
                                    color='secondary'
                                    variant="outlined"
                                    value={values.Objective}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    error={!!(errors.Objective && touched.Objective)}
                                    helperText={<ErrorMessage name="Objective" />}
                                />
                                <TextField
                                    label={t.expectedOutcomes}
                                    name="Expectedoutcomes"
                                    color='secondary'
                                    variant="outlined"
                                    value={values.Expectedoutcomes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={4}
                                    multiline
                                    fullWidth
                                    error={!!(errors.Expectedoutcomes && touched.Expectedoutcomes)}
                                    helperText={<ErrorMessage name="Expectedoutcomes" />}
                                />
                                <TextField
                                    label={t.iprOwnership}
                                    name="IPRownership"
                                    color='secondary'
                                    variant="outlined"
                                    value={values.IPRownership}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    fullWidth
                                    error={!!(errors.IPRownership && touched.IPRownership)}
                                    helperText={<ErrorMessage name="IPRownership" />}
                                />




                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format={DATE_FORMAT}
                                        label={t.timeFrame}
                                        // color='secondary'
                                        value={values.TimeFrame}
                                        onChange={(newValue) => setFieldValue('TimeFrame', newValue)}
                                        slotProps={{
                                            textField: {
                                                color: 'secondary',
                                                placeholder: DATE_FORMAT
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="contained" sx={{ bgcolor: '#616161', ':hover': { bgcolor: '#616161' } }} onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>{t.cancelButton}</Button>
                                    <Button variant="contained" type="submit" disabled={isSubmitting}>  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (editingJobs ? 'Edit' : 'Create')}</Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Drawer >
        </>
    );
};
export default AddProjects;
