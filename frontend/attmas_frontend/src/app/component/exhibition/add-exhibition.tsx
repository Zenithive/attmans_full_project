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
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useContext } from 'react';
import { Button, Chip, Divider, Drawer, FormControl, InputLabel, ListSubheader, ListSubheaderProps, OutlinedInput, Select, TextField, Autocomplete } from '@mui/material';
import { title } from 'process';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const AddExhibition = ({onAddExhibition}) => {
    const [open, toggleDrawer] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dateTime, setDateTime] = React.useState(new Date());
    const [categoryforIndustries, setCategoryforIndustries] = React.useState<string[]>([]);
    const [subject, setSubject] = React.useState<string[]>([]);

    const closeHandler = () => {
        toggleDrawer(false);
    };

    const handleCategoryChangeforIndustries = (event: any, value: string[]) => {
        setCategoryforIndustries(value);
    };

    const handleCategoryforSubject = (event: any, value: string[]) => {
        setSubject(value);
    };

    const handleDeleteIndustry = (industryToDelete: string) => {
        setCategoryforIndustries((industries) => industries.filter((industry) => industry !== industryToDelete));
    };

    const handleDeleteSubject = (subjectToDelete: string) => {
        setSubject((subjects) => subjects.filter((subject) => subject !== subjectToDelete));
    };

    const handleCreateExhibition = async () => {
        const exhibitionData = { title, description, industries: categoryforIndustries, subjects: subject };
    
        try {
          const response = await axios.post(APIS.EXHIBITION, exhibitionData);
          console.log('Exhibition Created:', response.data);
          onAddExhibition(response.data);
          setTitle('');
          setDescription('');
          setDateTime(new Date());
          setCategoryforIndustries([]);
          setSubject([]);
        } catch (error) {
          console.error('Error creating exhibition:', error);
        }
    
        toggleDrawer(false);
      };
    

    const handleCancelExhibition = () => {
        toggleDrawer(false);
    };
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

    return (
        <>
            <Button onClick={() => toggleDrawer(true)} type='button' size='small' variant='contained' sx={{ borderRadius: 3,background:"#616161",color:"white",'&:hover': {
      background: "#757575"  
    }}}>Create Exhibition</Button>
            <Drawer sx={{'& .MuiDrawer-paper': {width: "50%", borderRadius: 3, pr: 10, mr: -8}}} anchor="right" open={open} onClose={closeHandler}>
                <Box component="div" sx={{display:"flex", justifyContent: "space-between", pl: 4}}>
                    <h2>Create Exhibition</h2>
                    <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: '$5' }} />
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', p: 4, gap: 2 }}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                    />
                     
                    <Autocomplete
                        multiple
                        options={industries}
                        value={categoryforIndustries}
                        onChange={handleCategoryChangeforIndustries}
                        renderTags={(value, getTagProps) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {value.map((option:string, index) => (
                                    <Chip
                                        key={option}
                                        label={option}
                                        variant="outlined"
                                        onDelete={() => handleDeleteIndustry(option)}
                                        {...getTagProps({ index })}
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
                            />
                        )}
                    />
                    <Autocomplete
                        multiple
                        options={allSubjectItems}
                        groupBy={(option) => option.category}
                        getOptionLabel={(option) => option.label}
                        value={subject.map(label => allSubjectItems.find(item => item.label === label)!)}
                        onChange={(event, value) => handleCategoryforSubject(event, value.map(item => item.label))}
                        renderTags={(value, getTagProps) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {value.map((option, index) => (
                                    <Chip
                                        key={option.label}
                                        label={option.label}
                                        onDelete={() => handleDeleteSubject(option.label)}
                                        {...getTagProps({ index })}
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
                            />
                        )}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <span style={{fontWeight: 'bold'}}>{params.group}</span>
                                {params.children}
                            </li>
                        )}
                    />
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                        </LocalizationProvider>
                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="contained"  color='primary' onClick={handleCancelExhibition}>Cancel</Button>
                        <Button variant="contained" style={{background:"#616161",color:"white"}} onClick={handleCreateExhibition}>Create</Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};