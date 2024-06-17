'use client'
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, MenuItem } from '@mui/material';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel,Select, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import pubsub from '@/app/services/pubsub.service';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';

interface Exhibition {
    _id?: string;
    title: string;
    description: string;
    status: string;
    videoUrl:string;
    dateTime: string;
    industries: string[];
    subjects: string[];
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
    videoUrl: Yup.string().url('Invalid URL').required('Video URL is required'),
    dateTime: Yup.date().nullable('Date & Time is required'),
    categoryforIndustries: Yup.array().of(Yup.string()),
    subject: Yup.array().of(Yup.string())
});

export const AddExhibition = ({ editingExhibition, onCancelEdit }:AddExhibitionProps) => {
    const [open, toggleDrawer] = React.useState(false);
    
    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const initialValues = {
        title: '',
        description: '',
        status:'',
        videoUrl: '',
        dateTime: null as Dayjs | null,
        categoryforIndustries: [],
        subject: []
    };

    React.useEffect(() => {
        if (editingExhibition) {
            toggleDrawer(true);
        }
    }, [editingExhibition]);

    const industries = [
        "Agriculture",
        "Chemicals",
        "Electronics",
        "Energy",
        "Environmental and waste management",
        "Food and beverage",
        "Healthcare",
        "Medical devices and equipment",
        "Mining and metals",
        "Real estate and construction",
        "Textiles"
    ];

    const subjects = [
        {
            category: "Chemistry",
            items: [
                "Chemical Reagent Development",
                "Dewatering & Drying Technology",
                "Electronics",
                "Catalysis",
                "Trace Elements",
                "Mathematical Chemistry",
                "Dispersion Chemistry",
                "Surface Science"
            ]
        },
        {
            category: "Materials Science & Engineering",
            items: [
                "Nanotechnology & Nanomaterials",
                "Surface Chemistry",
                "Metallurgy",
                "Glass Science",
                "Ceramic Engineering",
                "Corrosion",
                "Structural Chemistry",
                "Microencapsulation",
                "Supramolecular Chemistry",
                "Fiber & Textile Engineering",
                "Carbon Materials",
                "Nanotechnology"
            ]
        },
        {
            category: "Biomaterials",
            items: [
                "Collagen",
                "Bioplastics",
                "Powder Metallurgy",
                "Powders & Bulk Materials",
                "Refractory Materials",
                "Composite Materials",
                "Electronic, Optical & Magnetic Materials",
                "Dental Materials",
                "Biocatalysis",
                "Marine Chemistry",
                "Coordination Compounds",
                "Inorganic Chemistry",
                "Natural Product Chemistry",
                "Molecular Engineering",
                "Physical Chemistry"
            ]
        },
        {
            category: "Physical Chemistry",
            items: [
                "Molecular Docking",
                "Chemoinformatics",
                "Biopolymers",
                "Polymer Chemistry"
            ]
        },
        {
            category: "Analytical Chemistry",
            items: [
                "Deformulation",
                "Separation & Purification Crystallography",
                "X-Ray Crystallography Spectroscopy",
                'Atomic Absorption Spectroscopy',
                'Atomic Emission Spectroscopy',
                'UV Spectroscopy ',
                'Fluorescence Spectroscopy',
                'Raman Spectroscopy',
                'NMR Spectroscopy',
                'Circular Dichroism Spectroscopy',
                'Spectrophotometry',
                'Mass Spectrometry',
                'Molecular Imaging',
                'Liquid Chromatography/HPLC',
                'Thermal Analysis',
                'Microcalorimetry',
                'Gas Chromatography',
                'Optical Rotation',
                'Particle Size Distribution',
                'Stable Isotope Analysis',
                'Particle-Induced X-Ray Emission',
                'Electrochemistry',
                'Agricultural Chemistry',
                "Cosmochemistry",
                "Radiochemistry",
                "Astrochemistry",
                "Petrochemistry",
            ]
        },
        {
            category: "Solid State Sciences",
            items: [
                "Condensed Matter Physics",
                "Solid-State Chemistry",
                "Flow Chemistry",
                "Green Chemistry",
                "Refractory Materials",
                "Organometallic Chemistry",
                "Photochemistry",
                "Quantum Chemistry",
            ]
        },
        {
            category: "Organic Chemistry",
            items: [
                "Retrosynthesis",
                "Thermochemistry",
                "Computational Chemistry",
                "Mechanochemistry",
                "Sonochemistry",
                "Peptide Synthesis",
                "Physical Organic Chemistry",
                "Adhesion Technology",
                "Applied Chemistry",
            ]
        },
        {
            category: "Agriculture",
            items: [
                "Plant Science:",
                "Agronomy:",
                "Plant Breeding:",
                "Mechanochemistry",
                "Sonochemistry",
                "Peptide Synthesis",
                "Physical Organic Chemistry",
                "Adhesion Technology",
                "Applied Chemistry",
            ]
        },
    ];

    const allSubjectItems = subjects.flatMap(subject => subject.items.map(item => ({
        category: subject.category,
        label: item
    })));

    const handleSubmit = async (values: { title: string; description: string; status:string;videoUrl:string,dateTime:Dayjs | null; categoryforIndustries: string[]; subject: string[]; }, { setSubmitting, resetForm }: any) => {
        const exhibitionData = {
            title: values.title,
            description: values.description,
            dateTime: values.dateTime ? values.dateTime.toISOString() : null,
            status:values.status,
            videoUrl:values.videoUrl,
            industries: values.categoryforIndustries,
            subjects: values.subject,
            userId:userDetails._id
            // userId:userDetails.username
        };

        try {
            if (editingExhibition) {
                await axios.put(`${APIS.EXHIBITION}/${editingExhibition._id}`, exhibitionData);
                pubsub.publish('ExhibitionUpdated', { message: 'Exhibition updated' });
            } else {
                 await axios.post(APIS.EXHIBITION, exhibitionData);
                // onAddExhibition(response.data);
                pubsub.publish('ExhibitionCreated', { message: 'A new exhibition Created' });
            }
            resetForm();
            toggleDrawer(false);
            onCancelEdit && onCancelEdit();
        } catch (error) {
            console.error('Error creating/updating exhibition:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained' sx={{
                borderRadius: 3, backgroundColor: "#616161", color: "white", '&:hover': {
                    background: "#757575"
                }
            }}>    {editingExhibition ? 'Edit Exhibition' : 'Create Exhibition'}</Button>
            <Drawer sx={{ '& .MuiDrawer-paper': { width: "50%", borderRadius: 3, pr: 10, mr: -8 } }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>
                <Box component="div" sx={{ display: "flex", justifyContent: "space-between", pl: 4 }}>
                    <h2> {editingExhibition ? 'Edit Exhibition' : 'Create Exhibition'}</h2>
                    <IconButton aria-describedby="id" onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                <Formik
                    initialValues={editingExhibition ? {
                        title: editingExhibition.title || '',
                        description: editingExhibition.description || '',
                        status:editingExhibition.status || '',
                        videoUrl:editingExhibition.videoUrl || "",
                        dateTime: editingExhibition.dateTime ? dayjs(editingExhibition.dateTime) : null,
                        categoryforIndustries: editingExhibition.industries || [],
                        subject: editingExhibition.subjects || []
                    } : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2,position:"relative",left:"15px" }}>
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
                                    fullWidth
                                    name="videoUrl"
                                    label="Video URL"
                                    color='secondary'
                                    value={values.videoUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.videoUrl && Boolean(errors.videoUrl)}
                                    helperText={touched.videoUrl && errors.videoUrl}
                                    margin="normal"
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
                                <Autocomplete
                                    multiple
                                    options={allSubjectItems}
                                    groupBy={(option) => option.category}
                                    getOptionLabel={(option) => option.label}
                                    value={values.subject.map((label: string) => allSubjectItems.find(item => item.label === label)!)}
                                    onChange={(event, value) => setFieldValue('subject', value.map(item => item.label))}
                                    renderTags={(value, getTagProps) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    label={option.label}
                                                    color='secondary'
                                                    {...getTagProps({ index })}
                                                    onDelete={() => setFieldValue('subject', values.subject.filter((sub: any) => sub !== option.label))}
                                                    key={option.label}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Subject matter expertise"
                                            color='secondary'
                                            placeholder="Select subjects"
                                            error={!!(errors.subject && touched.subject)}
                                            helperText={
                                                typeof errors.subject === 'string' && touched.subject
                                                  ? errors.subject
                                                  : undefined
                                              }
                                        />
                                    )}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <span style={{ fontWeight: 'bold' }}>{params.group}</span>
                                            {params.children}
                                        </li>
                                    )}
                                />
                               <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Date & Time"
                                    value={values.dateTime}
                                    onChange={(newValue) => setFieldValue('dateTime', newValue)}
                                />
                            </LocalizationProvider>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="contained" style={{ background: "#616161", color: "white" }} onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>Cancel</Button>
                                    <Button variant="contained" color='primary' type="submit" disabled={isSubmitting}>     {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (editingExhibition ? 'Edit' : 'Create')}</Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </>
    );
};
