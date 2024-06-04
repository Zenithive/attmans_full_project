'use client'
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel, ListSubheader, ListSubheaderProps, OutlinedInput, Select, TextField, Autocomplete } from '@mui/material';
import { title } from 'process';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import pubsub from '@/app/services/pubsub.service';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    dateTime: Yup.date().nullable('Date & Time is required'),
    categoryforIndustries: Yup.array().of(Yup.string()),
    subject: Yup.array().of(Yup.string())
});

export const AddExhibition = ({ onAddExhibition, editingExhibition, onCancelEdit }) => {
    const [open, toggleDrawer] = React.useState(false);

    const initialValues = {
        title: '',
        description: '',
        dateTime: null,
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

    const handleSubmit = async (values: { title: any; description: any; dateTime: { toISOString: () => any; }; categoryforIndustries: any; subject: any; }, { setSubmitting, resetForm }: any) => {
        const exhibitionData = {
            title: values.title,
            description: values.description,
            dateTime: values.dateTime.toISOString(),
            industries: values.categoryforIndustries,
            subjects: values.subject
        };

        try {
            if (editingExhibition) {
                await axios.put(`${APIS.EXHIBITION}/${editingExhibition._id}`, exhibitionData);
                pubsub.publish('ExhibitionUpdated', { message: 'Exhibition updated' });
            } else {
                const response = await axios.post(APIS.EXHIBITION, exhibitionData);
                onAddExhibition(response.data);
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
                        dateTime: editingExhibition.dateTime ? dayjs(editingExhibition.dateTime) : null,
                        categoryforIndustries: editingExhibition.industries || [],
                        subject: editingExhibition.subjects || []
                    } : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
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
                                    renderInput={(params:any) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            error={!!(errors.dateTime && touched.dateTime)}
                                            helperText={<ErrorMessage name="dateTime" />}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="contained" color='primary' onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>Cancel</Button>
                                    <Button variant="contained" style={{ background: "#616161", color: "white" }} type="submit" disabled={isSubmitting}>{editingExhibition ? 'Edit' : 'Create'}</Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </>
    );
};
