'use client'
import React, { useEffect, useState } from 'react';
import { Box, colors, Typography, Card, CardContent, IconButton, Button, Autocomplete, TextField } from '@mui/material';
import { AddApply } from '../component/apply/apply';
import { AddProjects } from '../component/projects/projects';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import pubsub from '../services/pubsub.service'; 
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Job {
    _id?: string;
    title: string;
    description: string;
    Budget: number;
    Expertiselevel: string;
    TimeFrame: string | null;
    Category: string[];
    Subcategorys: string[];
}

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

const Expertiselevel=[
    "Beginner",
    "Intermidiate",
    "Expert",
    "Phd"
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

const getSubcategorys = (Subcategorys: any[]) => {
    return Subcategorys.flatMap((Subcategory: { items: any; }) => Subcategory.items);
  };
const Jobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
    const [selectedExpertis,setSelectedExpertis]=useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hasMore,setHasMore]=useState(true);
    const [page, setPage] = useState(1);

    const fetchJobs = async (page: number) => {
        try {
            const response = await axios.get(APIS.JOBS, {
                params: { page, limit: 10 }
              });
              if (response.data.length === 0) {
                setHasMore(false);
              } else{
                setJobs((prev) => {
                  const newJobs = response.data.filter((newJobs: Job) => {
                    return !prev.some((existingJobs) => existingJobs._id === newJobs._id);
                  });
                  console.log("...prev, ...newJobs",[...prev, ...newJobs])
                  return [...prev, ...newJobs];
                });
              }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const refetch = async () => {
        try {
            setPage(1);
            setJobs([]);
            setHasMore(true);
            await fetchJobs(1);
        } catch (error) {
            console.error('Error refetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page]);

    useEffect(() => {
        pubsub.subscribe('JobUpdated', refetch);
    
        return () => {
          pubsub.unsubscribe('JobUpdated', refetch);
        };
    
      }, []);

    
      useEffect(() => {
        pubsub.subscribe('JobCreated', refetch);
    
        return () => {
          pubsub.unsubscribe('JobCreated', refetch);
        };
    
      }, []);  

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
    };

    const handleCancelEdit = () => {
        setEditingJob(null);
    };

    const handleDeleteJob = async (jobToDelete: Job) => {
        try {
            await axios.delete(`${APIS.JOBS}/${jobToDelete._id}`);
            setJobs(jobs.filter(job => job._id !== jobToDelete._id));
            pubsub.publish('JobDeleted', {});
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleApplyClick = (title:string) => {
        setApplyOpen(true); 
        setJobTitle(title); 
    };

    const filteredProjects = jobs.filter(project =>
        (selectedCategory.length === 0 || selectedCategory.some(Categorys => project.Category.includes(Categorys))) &&
        (selectedSubcategory.length === 0 || selectedSubcategory.some(Subcategory => project.Subcategorys.includes(Subcategory))) &&
        (selectedExpertis.length === 0 || selectedExpertis.some(expertiselevel=> project.Expertiselevel.includes(expertiselevel)))
      );

    return (
        <Box sx={{ background: colors.grey[100], p: 2, borderRadius: "30px !important",overflowX:"hidden !important"}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h2" sx={{ marginY: 0 }}>Post Jobs</Typography>
                <Box sx={{position:"relative",left:"69%",width:"60%",display:"flex"}}>
                <IconButton onClick={() => setFilterOpen(prev => !prev)}>
                    <FilterAltIcon />
                </IconButton>
        {filterOpen && (
             <Box sx={{ display: "flex", gap: 3 ,width:"90%"}}>
                <Autocomplete
                sx={{position:"relative",right:"39%",width:"35%"}}
                multiple
                size='small'
                options={Expertiselevel}
                value={selectedExpertis}
                onChange={(event, value) => setSelectedExpertis(value)}
                renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Expertise-Level" color='secondary' sx={{borderRadius:"20px"}} />}
                />
                <Autocomplete
                multiple
                sx={{position:"relative",right:"110%",width:"35%"}}
                size='small'
                options={getSubcategorys(Subcategorys)}
                value={selectedSubcategory}
                onChange={(event, value) => setSelectedSubcategory(value)}
                renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Subcategorys" color='secondary' sx={{borderRadius: "20px"}}/>}
                />
                <Autocomplete
                sx={{position:"relative",right:"176.2%",width:"30%"}}
                multiple
                size='small'
                options={Category}
                value={selectedCategory}
                onChange={(event, value) => setSelectedCategory(value)}
                renderInput={(params) => <TextField {...params} variant="outlined" label="Filter by Categorys" color='secondary' sx={{borderRadius:"20px"}} />}
                />
              </Box>
        )}
        </Box>
      <AddProjects editingJobs={editingJob} onCancelEdit={handleCancelEdit} />
      </Box>
      <InfiniteScroll
        dataLength={filteredProjects.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<Typography>Loading...</Typography>}
        endMessage={<Typography>You are all set!</Typography>}
      >
            <Box sx={{ mt: 2 }}>
                {filteredProjects.map((job) => (
                    <Card key={job._id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h5">
                                {job.title}
                                <span style={{ fontSize: 'small', color: "#616161" }}>
                                    ({dayjs(job.TimeFrame).format('MMMM D, YYYY h:mm A')})
                                </span>
                                <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                                    {job.Expertiselevel}
                                </span>
                            </Typography>
                            <Typography variant="body2">{job.description}</Typography>
                            <Typography variant="body2">{job.Budget}</Typography>
                            <Typography variant="caption">{job.Category.join(', ')}, {job.Subcategorys.join(', ')}</Typography>
                            <Box sx={{float:"right"}}>
                                <Button variant="contained" color="primary" onClick={() => handleApplyClick(job.title)}>
                                    Apply
                                </Button>
                                
                                    <IconButton onClick={() => handleEditJob(job)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteJob(job)}>
                                        <DeleteRoundedIcon />
                                    </IconButton>
                            </Box>        
                        </CardContent>
                    </Card>
                ))}
            </Box>
            </InfiniteScroll>
            <AddApply open={applyOpen} setOpen={setApplyOpen} jobTitle={jobTitle} />
        </Box>
    );
};

export default Jobs;
