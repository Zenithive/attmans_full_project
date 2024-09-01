'use client';
import React, { useEffect, useState } from 'react';
import { Box, colors, Typography, Card, CardContent, IconButton, Autocomplete, TextField, Tooltip, ToggleButton, ToggleButtonGroup, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AddExhibition } from '../component/exhibition/add-exhibition';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { PubSub, pubsub } from '../services/pubsub.service';
import SendIcon from '@mui/icons-material/Send';
import { SendInnovators } from '../component/exhibition/send-innovators';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import DeleteConfirmationDialog from '../component/deletdilog/deletdilog';
import EditProfile from '../component/EditProfileComponents/editUserProfile';
import { categories } from '../constants/categories';
import Filters, { FilterColumn } from '../component/filter/filter.component';
import { DATE_TIME_FORMAT } from '../constants/common.constants';

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
  userId?: string;
  username: string;
}

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


const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [sendingExhibition, setSendingExhibition] = useState<Exhibition | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filter, setFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; exhibition: Exhibition | null }>({ open: false, exhibition: null });

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const { userType, _id: userId, username } = userDetails;

  const column: Array<FilterColumn> = [
    {
      name: "Title",
      value: '',
      type: "Texbox",
      key: 'title',
      isVisible: true,
    },
    {
      name: "Created Date",
      value: '',
      type: "Date",
      key: 'createdAt',
      isVisible: true,
    },
    {
      name: "Exhibition Date",
      value: '',
      type: "Date",
      key: 'dateTime',
      isVisible: true,
    },
    {
      name: "Status",
      value: '',
      type: "Texbox",
      key: 'status',
      isVisible: (userType === "Admin" || userType === "Project Owner"),
    },
    {
      name: "Preferred Industries",
      value: '',
      type: "Category",
      key: 'industries',
      isVisible: true,
    },
    {
      name: "Subject Matter Expertise",
      value: '',
      type: "SubCategory",
      key: 'subjects',
      isVisible: true,
    }
  ];

  const fetchExhibitions = useCallback(async (page: number) => {
    try {
      const response = await axios.get(`${APIS.EXHIBITION}?page=${page}&${filter}`);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setExhibitions((prev) => {
          const newExhibitions = response.data.filter((newExhibition: Exhibition) => {
            return !prev.some((existingExhibition) => existingExhibition._id === newExhibition._id);
          });
          return [...prev, ...newExhibitions];
        });
        if (response.data.length < 10) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  }, [userId, filterType, filter]);

  const refetch = useCallback(async () => {
    try {
      setPage(1);
      setExhibitions([]);
      setHasMore(true);
      await fetchExhibitions(1);
    } catch (error) {
      console.error('Error refetching exhibitions:', error);
    }
  }, [fetchExhibitions]);

  useEffect(() => {
    refetch();
  }, [filter, filterType]);

  useEffect(() => {
    if (page > 1) {
      fetchExhibitions(page);
    }
  }, [page, filter]);

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

  const handleEditExhibition = useCallback((exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingExhibition(null);
  }, []);

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

  const handleSendInnovators = useCallback((exhibition: Exhibition) => {
    setSendingExhibition(exhibition);
  }, []);

  const handleCancelSend = useCallback(() => {
    setSendingExhibition(null);
  }, []);

  const handleFilterChange = useCallback(() => {
    refetch();
  }, [refetch]);

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

  const changeFilterOrPage = (paramStr: string) => {
    if (paramStr && paramStr.length) {
      setFilter(paramStr);
    } else {
      setFilter('');
    }
    setPage(1);
  }


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

        <Box sx={{
          mr: 2, display: "flex"
        }}>
          <Filters column={column} onFilter={changeFilterOrPage}></Filters>
          <AddExhibition editingExhibition={editingExhibition} onCancelEdit={handleCancelEdit} />
        </Box>
      
      </Box>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
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
                    <a href={`/view-exhibition?exhibitionId=${exhibition._id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>
                      <Typography variant="h6" component="span">
                        {exhibition.title}
                      </Typography>
                    </a>
                  </span>
                  <span style={{ fontSize: 'small', color: "#616161" }}>
                    ({!exhibition.exhbTime ? dayjs(exhibition.dateTime).format(DATE_TIME_FORMAT): exhibition.dateTime} {exhibition.exhbTime || ''})
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
