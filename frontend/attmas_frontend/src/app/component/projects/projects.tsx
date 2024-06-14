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
import pubsub from '@/app/services/pubsub.service';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';


interface Jobs {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
}

interface AddJobsProps {
    editingJobs?: Jobs | null;
    onCancelEdit?: () => void;
}


const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    Expertiselevel: Yup.string(),
    Budget: Yup.number().required("Budget is required"),
    TimeFrame: Yup.date().nullable('Date & Time is required'),
    categoryforCategory: Yup.array().of(Yup.string()),
    Subcategory: Yup.array().of(Yup.string())
});

export const AddProjects = ({ editingJobs, onCancelEdit }: AddJobsProps) => {
    const [open, toggleDrawer] = React.useState(false);

    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const initialValues = {
        title: '',
        description: '',
        Expertiselevel: '',
        Budget: 0,
        TimeFrame: null as Dayjs | null,
        categoryforCategory: [],
        Subcategory: [],
        // username: userDetails.username

    };

    React.useEffect(() => {
        if (editingJobs) {
            toggleDrawer(true);
        }
    }, [editingJobs]);

    const Category = [
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

    const Subcategorys = [
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

    const allSubcategoryItems = Subcategorys.flatMap(Subcategory => Subcategory.items.map(item => ({
        category: Subcategory.category,
        label: item
    })));


    const handleSubmit = async (values: { title: string; description: string; Expertiselevel: string; Budget: number, TimeFrame: Dayjs | null; categoryforCategory: string[]; Subcategory: string[]; }, { setSubmitting, resetForm }: any) => {
        const jobsData = {
            title: values.title,
            description: values.description,
            TimeFrame: values.TimeFrame ? values.TimeFrame.toISOString() : null,
            Expertiselevel: values.Expertiselevel,
            Budget: values.Budget,
            Category: values.categoryforCategory,
            Subcategorys: values.Subcategory,
            userId:userDetails._id,
        };

        try {
            if (editingJobs) {
                await axios.put(`${APIS.JOBS}/${editingJobs._id}`, jobsData);
                pubsub.publish('JobUpdated', { message: 'Jobs updated' });
            } else {
                const response = await axios.post(APIS.JOBS, jobsData);
                //onAddJobs(response.data);
                pubsub.publish('JobCreated', { message: 'A new Job Created' });
            }
            resetForm();
            toggleDrawer(false);
            onCancelEdit && onCancelEdit();
        } catch (error) {
            console.error('Error creating/updating jobs:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained'> Create Projects</Button>
            <Drawer sx={{ '& .MuiDrawer-paper': { width: "50%", borderRadius: 3, pr: 10, mr: -8 } }} anchor="right" open={open} onClose={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>
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
                        Expertiselevel: editingJobs.Expertiselevel || '',
                        Budget: editingJobs.Budget || 0,
                        TimeFrame: editingJobs.TimeFrame ? dayjs(editingJobs.TimeFrame) : null,
                        categoryforCategory: editingJobs.Category || [],
                        Subcategory: editingJobs.Subcategorys || []
                    } : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, position: "relative", left: "15px" }}>
                                <TextField
                                    label="Title"
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
                                    color='secondary'
                                    label="BUDGET"
                                    type="number"
                                    value={values.Budget}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.Budget && Boolean(errors.Budget)}
                                    helperText={touched.Budget && errors.Budget}
                                    margin="normal"
                                />
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
                                        label="Expertise Level"
                                    >
                                        <MenuItem value="Beginner">Beginner </MenuItem>
                                        <MenuItem value="Intermidiate">Intermidiate</MenuItem>
                                        <MenuItem value="Expert">Expert</MenuItem>
                                        <MenuItem value="Phd">Phd</MenuItem>
                                    </Select>
                                </FormControl>
                                <Autocomplete
                                    multiple
                                    options={Category}
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
                                            label="Preferred Category"
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
                                <Autocomplete
                                    multiple
                                    options={allSubcategoryItems}
                                    groupBy={(option) => option.category}
                                    getOptionLabel={(option) => option.label}
                                    value={values.Subcategory.map((label: string) => allSubcategoryItems.find(item => item.label === label)!)}
                                    onChange={(event, value) => setFieldValue('Subcategory', value.map(item => item.label))}
                                    renderTags={(value, getTagProps) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {value.map((option, index) => (
                                                <Chip
                                                    label={option.label}
                                                    color='secondary'
                                                    {...getTagProps({ index })}
                                                    onDelete={() => setFieldValue('subject', values.Subcategory.filter((sub: any) => sub !== option.label))}
                                                    key={option.label}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Subcategory matter expertise"
                                            color='secondary'
                                            placeholder="Select Subcategorys"
                                            error={!!(errors.Subcategory && touched.Subcategory)}
                                            helperText={
                                                typeof errors.Subcategory === 'string' && touched.Subcategory
                                                    ? errors.Subcategory
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
                                <LocalizationProvider  dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Time Frame"
                                        // color='secondary'
                                        value={values.TimeFrame}
                                        onChange={(newValue) => setFieldValue('TimeFrame', newValue)}

                                        slotProps={{
                                            textField: {
                                                color:'secondary'      
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="contained" sx={{bgcolor: '#616161', ':hover': {bgcolor: '#616161'} }} onClick={() => { toggleDrawer(false); onCancelEdit && onCancelEdit(); }}>Cancel</Button>
                                    <Button variant="contained" type="submit" disabled={isSubmitting}>  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (editingJobs ? 'Edit' : 'Create')}</Button>
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </>
    );
};
