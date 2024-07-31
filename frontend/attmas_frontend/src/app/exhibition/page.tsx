'use client';
import React, { useEffect, useState } from 'react';
import { Box, colors, Typography, Card, CardContent, IconButton, Autocomplete, TextField, Tooltip, ToggleButton, ToggleButtonGroup, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { AddExhibition } from '../component/exhibition/add-exhibition';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { PubSub,pubsub } from '../services/pubsub.service';
import SendIcon from '@mui/icons-material/Send';
import { SendInnovators } from '../component/exhibition/send-innovators';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo,useCallback } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import DeleteConfirmationDialog from '../component/deletdilog/deletdilog';
import EditProfile from '../component/EditProfileComponents/editUserProfile';

interface Exhibition {
  _id?: string;
  title: string;
  description: string;
  status: string;
  videoUrl: string;
  dateTime: string;
  industries: string[];
  subjects: string[];
  userId?: string;
  username: string;
}

const industries =[
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

const getSubjectItems =(subjects: any[]) => {
  return subjects.flatMap((subject: { items: any; }) => subject.items);
};

const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [sendingExhibition, setSendingExhibition] = useState<Exhibition | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hasMore,setHasMore]=useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; exhibition: Exhibition | null }>({ open: false, exhibition: null });

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const { userType, _id: userId, username } = userDetails;

  const fetchExhibitions =useCallback(async (page: number, industriesFilter: string[], subjectsFilter: string[]) => {
    try {
      const response = await axios.get(APIS.EXHIBITION, {
        params: {
          page,
          limit: 10,
          industries: industriesFilter.join(','),
          subjects: subjectsFilter.join(','),
          userId: filterType === 'mine' ? userId : undefined
        }
      });
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setExhibitions((prev) => {
          const newExhibitions = response.data.filter((newExhibition: Exhibition) => {
            return !prev.some((existingExhibition) => existingExhibition._id === newExhibition._id);
          });
          console.log("...prev, ...newExhibitions",[...prev, ...newExhibitions])
          return [...prev, ...newExhibitions];
        });
        if (response.data.length < 10) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  },[userId,filterType]);

  const refetch =useCallback(async () => {
    try {
      setPage(1);
      setExhibitions([]);
      setHasMore(true); 
      await fetchExhibitions(1, selectedIndustries, selectedSubjects); 
    } catch (error) {
      console.error('Error refetching exhibitions:', error);
    }
  },[fetchExhibitions,selectedIndustries,selectedSubjects]);

  useEffect(() => {
    refetch(); 
  }, [selectedIndustries, selectedSubjects,filterType]);

  useEffect(() => {
    if (page > 1) {
      fetchExhibitions(page, selectedIndustries, selectedSubjects); 
    }
  }, [page]);

  useEffect(() => {
    pubsub.subscribe('ExhibitionCreated', refetch);
    return () => {
      pubsub.unsubscribe('ExhibitionCreated', refetch);
    };
  }, []);

  useEffect(() => {
    pubsub.subscribe('ExhibitionUpdated', refetch);

    return () => {
      pubsub.unsubscribe('ExhibitionUpdated', refetch);
    };
  }, []);

  const handleEditExhibition =useCallback((exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
  },[]);

  const handleCancelEdit =useCallback(() => {
    setEditingExhibition(null);
  },[]);

  const handleDeleteExhibition = useCallback(async () => {
    if (confirmDelete.exhibition) {
      try {
        await axios.delete(`${APIS.EXHIBITION}/${confirmDelete.exhibition._id}`);
        setExhibitions(exhibitions.filter(exhibition => exhibition._id !== confirmDelete.exhibition!._id));
        pubsub.publish('ExhibitionDeleted', { message: 'Exhibition Deleted' });
      } catch (error) {
        console.error('Error deleting exhibition:', error);
      } finally {
        setConfirmDelete({ open: false, exhibition: null });
      }
    }
  }, [confirmDelete, exhibitions]);

  const handleSendInnovators =useCallback((exhibition: Exhibition) => {
    setSendingExhibition(exhibition);
  },[]);

  const handleCancelSend =useCallback(() => {
    setSendingExhibition(null);
  },[]);

  const handleFilterChange =useCallback(() => {
    refetch();
  },[refetch]);

  const handleFilterTypeChange = (event: React.MouseEvent<HTMLElement>, newFilterType: string) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };


  const handleConfirmDelete = (exhibition: Exhibition) => {
    setConfirmDelete({ open: true, exhibition });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, exhibition: null });
  };


  return (
    <Box
  sx={{
    background: colors.grey[100],
    p: 2,
    borderRadius: "30px !important",
    overflowX: "hidden",
    '@media (max-width: 767px)': {
      position: 'relative',
      left: '25px',
    },
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '@media (max-width: 767px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    }}
  >
    <Typography component="h2" sx={{ marginY: 0, fontSize: "20px" }}>
      Exhibitions
    </Typography>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2,
        height: "30px",
        position: "relative",
        top: "8px",
        '@media (max-width: 767px)': {
          position: 'relative',
          right: '-106px',
          top: '-27px',
        },
      }}
    >
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterTypeChange}
        aria-label="filter exhibitions"
      >
        <ToggleButton value="all" aria-label="all exhibitions" sx={{ fontSize: "10px" }}>
          All Exhibitions
        </ToggleButton>
        <ToggleButton value="mine" aria-label="my exhibitions" sx={{ fontSize: "10px" }}>
          My Exhibitions
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
    <Box
  sx={{
    position: "relative",
    left: "57%",
    width: "60%",
    display: "flex",
    alignItems: "center",
    '@media (max-width: 767px)': {
      position: 'relative',
      left: '4px',
      width: '100%',
      justifyContent: 'flex-start',
      bottom: '22px',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  }}
>
  <IconButton onClick={() => setFilterOpen(prev => !prev)}>
    <Tooltip title="Filter">
      <FilterAltIcon />
    </Tooltip>
  </IconButton>
  {filterOpen && (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        width: "75%",
        '@media (max-width: 767px)': {
          flexDirection: 'column',
          width: '100%',
          gap: 1,
          mt: 2, 
        },
      }}
    >
      <Autocomplete
        multiple
        size='small'
        sx={{
          width: "35%",
          position: "relative",
          right: "43.5%",
          '@media (max-width: 767px)': { width: '100%', right: '0' }
        }}
        options={getSubjectItems(subjects)}
        value={selectedSubjects}
        onChange={(event, value) => setSelectedSubjects(value)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Filter by Subjects" color='secondary' sx={{ borderRadius: "20px" }} />
        )}
      />
      <Autocomplete
        multiple
        sx={{
          width: "35%",
          position: "relative",
          right: "122%",
          '@media (max-width: 767px)': { width: '100%', right: '0' }
        }}
        size='small'
        options={industries}
        value={selectedIndustries}
        onChange={(event, value) => setSelectedIndustries(value)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Filter by Industries" color='secondary' sx={{ borderRadius: "20px" }} />
        )}
      />
    </Box>
  )}
</Box>

    <Box
      sx={{
        '@media (max-width: 767px)': {
          position: 'absolute',
          top:'80px',
          right:'25%'
        },
      }}
    >
      <AddExhibition editingExhibition={editingExhibition} onCancelEdit={handleCancelEdit} />
    </Box>
  </Box>
      <InfiniteScroll
        dataLength={exhibitions.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<Typography>Loading...</Typography>}
        endMessage={<Typography>No more Exhibitions</Typography>}
      >
      <Box sx={{ mt: 2 }}>
        {exhibitions.map((exhibition) => (
          <Card key={exhibition._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5">
              <span style={{ cursor: 'pointer', marginRight: 10 }}>
                <a href={`/view-exhibition?exhibitionId=${exhibition._id}`} target="_blank" rel="noopener noreferrer" style={{color: 'black', textDecoration: 'none'}}>
                  <Typography variant="h6" component="span">
                    {exhibition.title}
                  </Typography>
                </a>
              </span>
                <span style={{ fontSize: 'small', color: "#616161" }}>
                  ({dayjs(exhibition.dateTime).format('MMMM D, YYYY h:mm A')})
                </span>
                <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                  {exhibition.status}
                </span>
              </Typography>
              <Typography variant="caption">{exhibition.industries.join(', ')}, {exhibition.subjects.join(', ')}</Typography>
              <Typography sx={{ display: "flex", float: "right" }}>
              {userType === "Admin" && (
                <IconButton onClick={() => handleEditExhibition(exhibition)}>
                <Tooltip title="Edit">
                  <EditIcon />
                  </Tooltip>
                </IconButton>
                 )}
                {userType === "Admin" && (
                    <IconButton onClick={() => handleConfirmDelete(exhibition)}>
                      <Tooltip title="Delete">
                        <DeleteRoundedIcon />
                      </Tooltip>
                    </IconButton>
                  )}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      </InfiniteScroll>
      <DeleteConfirmationDialog
      open={confirmDelete.open}
      onCancel={handleCancelDelete}
      onConfirm={handleDeleteExhibition}
      title={confirmDelete.exhibition?.title || ''}
/>
    </Box>
  );
};

export default Exhibition;
