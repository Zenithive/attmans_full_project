'use client';
import React, { useEffect, useState } from 'react';
import { Box, colors, Typography, Card, CardContent, IconButton, Autocomplete, TextField, Tooltip, ToggleButton, ToggleButtonGroup, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AddExhibition } from '../component/exhibition/add-exhibition';
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
import axiosInstance from '../services/axios.service';
import { translationsforMyProjectPage } from '../../../public/trancation';

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
  boothCounts?: BoothCounts;
}

type BoothCounts = {
  approved: number;
  pending: number;
  rejected: number;
};




const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [sendingExhibition, setSendingExhibition] = useState<Exhibition | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [toggleFilter, setToggleFilter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filter, setFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; exhibition: Exhibition | null }>({ open: false, exhibition: null });

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const language = userDetails.language || 'english';
  const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;

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
      const response = await axiosInstance.get(`${APIS.EXHIBITION}?page=${page}${toggleFilter}&${filter}`);
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
  }, [userId, toggleFilter, filter]);

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
  }, [filter, toggleFilter]);

  useEffect(() => {
    if (page > 1) {
      fetchExhibitions(page);
    }
  }, [page, filter, toggleFilter]);

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
        await axiosInstance.delete(`${APIS.EXHIBITION}/${confirmDelete.exhibition._id}`);
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
    //setFilterType(`&userId=${userId}`);
    setFilterType(newFilterType);
    if (newFilterType == 'mine') {
      setToggleFilter(`&userId=${userId}`);
    } else {
      setToggleFilter(``);
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
          {t.exhibition}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            '@media (max-width: 767px)': {
              flexDirection: 'column',
              width: '100%',
              alignItems: 'flex-start',
              gap: 1,
            },
          }}
        >
          <Box sx={{
            flex: '0 1 auto', '@media (max-width: 767px)': {
              width: 'fit-content',
              position: 'relative',
              right: '21%',
              bottom: '35px'
            }
          }}>
            <Filters column={column} onFilter={changeFilterOrPage} />
          </Box>
          <Box sx={{
            flex: '0 1 auto', '@media (max-width: 767px)': {
              position: 'relative',
              bottom: '20px'
            }
          }}>
            <AddExhibition editingExhibition={editingExhibition} onCancelEdit={handleCancelEdit} />
          </Box>
        </Box>
      </Box>

      {userType === "Admin" && <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 2,
          height: "30px",
          position: "relative",
          top: "8px",
          '@media (max-width: 767px)': {
            position: 'relative',
            left: '52px'
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
      </Box>}
      <InfiniteScroll
        dataLength={exhibitions.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<Typography>Loading...</Typography>}
        endMessage={<Typography>{t.nomoreexhibitions}</Typography>}
      >
        <Box sx={{ mt: 2 }}>
          {/* {exhibitions.map((exhibition) => (
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
                <Typography variant="caption">{exhibition.industries.join(', ')} | {exhibition.subjects.join(', ')}</Typography>
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
          ))} */}

          {exhibitions.map((exhibition) => (
            <Card key={exhibition._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5">
                  <span style={{ cursor: 'pointer', marginRight: 10 }}>
                    <a
                      href={`/view-exhibition?exhibitionId=${exhibition._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'black', textDecoration: 'none' }}
                    >
                      <Typography variant="h6" component="span">
                        {exhibition.title}
                      </Typography>
                    </a>

                  </span>
                  <span style={{ fontSize: 'small', color: "#616161" }}>
                    (
                    {!exhibition.exhbTime
                      ? dayjs(exhibition.dateTime).format(DATE_TIME_FORMAT)
                      : exhibition.dateTime} {exhibition.exhbTime || ''}
                    )
                  </span>
                  <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                    {exhibition.status}
                  </span>
                </Typography>

                <Typography variant="caption">
                  {exhibition.industries.join(', ')} | {exhibition.subjects.join(', ')}
                </Typography>

                {/* Booth Status Counts (Visible only to Admin) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {userType === "Admin" && (
                    <Typography variant="body2">
                      <strong>Booth:</strong> (<strong>Approved:</strong> {exhibition.boothCounts?.approved || 0} | <strong>Rejected:</strong> {exhibition.boothCounts?.rejected || 0} | <strong>Pending:</strong> {exhibition.boothCounts?.pending || 0})
                    </Typography>
                  )}

                  <a
                    href={`/view-exhibition?exhibitionId=${exhibition._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline', fontSize: 'medium' }}
                  >
                    <Typography variant="h6" component="span" sx={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'inherit' }}>
                      {/* View Exhibition */}
                      {t.viewexhibition}
                    </Typography>
                  </a>
                </Box>

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
