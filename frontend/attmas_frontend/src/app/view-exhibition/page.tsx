'use client'
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent, Button, Chip, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import BoothDetailsModal from '../component/booth/booth';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmationDialog from '../component/deletdilog/deletdilog';

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
}

interface Booth {
  _id: string;
  title: string;
  description: string;
  products: { name: string; description: string; productType: string; price: number; currency: string; }[];
  userId: {
    firstName: string;
    lastName: string;
  };
  status: string;
  exhibitionId: string;
  createdAt: string;
}

const ExhibitionsPage: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const searchParams = useSearchParams();
  const { userType } = userDetails;
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState<{ open: boolean; booth: Booth | null }>({ open: false, booth: null });
  const [rejectDialogOpen, setRejectDialogOpen] = useState<{ open: boolean; booth: Booth | null }>({ open: false, booth: null });
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const exhibitionId = searchParams.get('exhibitionId');
        if (!exhibitionId) {
          console.error('id not found');
          return;
        }
        const response = await axios.get(`${APIS.EXHIBITION}/${exhibitionId}`);
        setExhibitions([response.data]);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBooths = async () => {
      try {
        const response = await axios.get(`${APIS.GET_BOOTH}`, {
          params: {
            userId: userDetails?._id,
            status: statusFilter === 'All' ? '' : statusFilter,
          },
        });
        setBooths(response.data);
      } catch (error) {
        console.error('Error fetching booths:', error);
      }
    };

    fetchExhibitions();
    fetchBooths();
  }, [userDetails?._id, searchParams, statusFilter]);

  const handleCreateBooth = async (boothData: any) => {
    try {
      const exhibitionId = searchParams.get('exhibitionId');
      if (!exhibitionId) {
        console.error('Exhibition ID not found');
        return;
      }

      boothData.exhibitionId = exhibitionId;

      const response = await axios.post(APIS.CREATE_BOOTH, boothData);
      if (response.data.exhibitionId === exhibitionId) {
        setBooths(prevBooths => [...prevBooths, response.data]);
      } else {
        console.error('Booth created does not belong to the current exhibition');
      }
      closeModal();
    } catch (error) {
      console.error('Error creating booth:', error);
    }
  };

  const handleApprove = async () => {
    try {
      const { booth } = approveDialogOpen;
      if (!booth) return;
      await axios.post(`${APIS.APPROVE_BOOTH}/${booth._id}`);
      setBooths(prevBooths =>
        prevBooths.map(b =>
          b._id === booth._id ? { ...b, status: 'Approved' } : b
        )
      );
      setStatusFilter('Approved'); 
    } catch (error) {
      console.error('Error approving booth:', error);
    } finally {
      setApproveDialogOpen({ open: false, booth: null });
    }
  };

  const handleReject = async () => {
    try {
      const { booth } = rejectDialogOpen;
      if (!booth) return;
      await axios.post(`${APIS.REJECT_BOOTH}/${booth._id}`);
      setBooths(prevBooths =>
        prevBooths.map(b =>
          b._id === booth._id ? { ...b, status: 'Rejected' } : b
        )
      );
      setStatusFilter('Rejected');
    } catch (error) {
      console.error('Error rejecting booth:', error);
    } finally {
      setRejectDialogOpen({ open: false, booth: null });
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const exhibitionId = searchParams.get('exhibitionId');

  const handleStatusFilterChange = (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => {
    setStatusFilter(newStatus);
  };

  const renderVideo = (url: string) => {
    if (!url) {
      return null;
    }

    const platforms = [
      {
        name: 'YouTube',
        check: (url: string) => url.includes('youtube.com') || url.includes('youtu.be'),
        embedUrl: (url: string) => {
          const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
          return `https://www.youtube.com/embed/${videoId}`;
        }
      },
      {
        name: 'Vimeo',
        check: (url: string) => url.includes('vimeo.com'),
        embedUrl: (url: string) => {
          const videoId = url.split('vimeo.com/')[1];
          return `https://player.vimeo.com/video/${videoId}`;
        }
      },
      {
        name: 'Pexels',
        check: (url: string) => url.includes('pexels.com'),
        embedUrl: (url: string) => {
          const videoId = url.split('pexels.com/')[1];
          return `https://www.pexels.com/video/${videoId}`;
        }
      },
      {
        name: 'Default',
        check: (url: string) => true,
        embedUrl: (url: string) => url
      }
    ];

    const platform = platforms.find(p => p.check(url));
    const embedUrl = platform?.embedUrl(url);

    if (platform?.name === 'Default') {
      return (
        <video width="1100" controls>
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <iframe
          width="750"
          height="500"
          style={{ borderRadius: "30px" }}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <div style={{ position: "relative", color: 'black', textAlign: "left", background: "#f5f5f5", right: "8px", width: "102%", bottom: "29px",height:'6%' }}>
          <h1 style={{ position: 'relative', top: "15%" ,left:'30px'}}>Exhibition</h1>
          {(userDetails && userType === 'Innovators') && (
            <Button variant="contained" color="primary" onClick={openModal} style={{ position: 'relative', float: "right", bottom: '60px', right: '5%', background: '#757575', fontWeight: 'bolder', color: 'white', height: '32px', backgroundColor: '#CC4800' }}>
              Participate
            </Button>
          )}
          <BoothDetailsModal open={showModal} onClose={closeModal} createBooth={handleCreateBooth} exhibitionId={exhibitionId} />
        </div>
        <div>
          {exhibitions.map((exhibition) => (
            <Box key={exhibition._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Card sx={{ flex: 1, marginRight: '10px' }}>
                <CardContent>
                  {renderVideo(exhibition.videoUrl)}
                </CardContent>
              </Card>
              <Divider orientation="vertical" flexItem />
              <Card sx={{ flex: 1, marginLeft: '10px', marginBottom: '20%' }}>
                <CardContent>
                  <Typography variant="h6">{exhibition.title}, ({dayjs(exhibition.dateTime).format('MMMM D, YYYY h:mm A')})</Typography>
                  <Typography variant="h6">{exhibition.description}</Typography>
                  <Typography variant="h6"> {exhibition.industries}</Typography>
                  <Typography variant="h6">{exhibition.subjects}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </div>
        <Divider orientation="horizontal" flexItem />
        <div>
          <Box sx={{ width: '40%', color: 'black', position: 'relative', left: '11%', top: '20px' }}>
            <h1>Booth Details</h1>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              aria-label="status filter"
              sx={{ position: 'relative', left: '40%', bottom: '63px' }}
            >
              <ToggleButton value="All" aria-label="all">All
              </ToggleButton>
              <ToggleButton value="Pending" aria-label="pending">
                Pending
              </ToggleButton>
              <ToggleButton value="Approved" aria-label="approved">
                Approved
              </ToggleButton>
              <ToggleButton value="Rejected" aria-label="rejected">
                Rejected
              </ToggleButton>
            </ToggleButtonGroup>

          </Box>
          <Grid container spacing={2} sx={{ padding: '10px', position: 'relative', left: '10%', width: '80%' }}>
            {booths
              .filter(booth => booth.exhibitionId === exhibitionId)
              .filter(booth => {
                if (statusFilter === 'All') {
                  return true; 
                } else {
                  return booth.status === statusFilter; 
                }
              })
              .filter(booth => userType === 'Innovators' || userType === 'Admin' || booth.status === 'Approved')
              .map(booth => (
                <Grid item xs={12} sm={6} md={4} key={booth._id}>
                  <Card sx={{ boxSizing: 'border-box', marginBottom: '10px' }}>
                    <CardContent>
                      <Tooltip title="Click here to see Booth details" arrow placement="top" PopperProps={{
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -20],
                            },
                          },
                        ],
                      }}>
                        <Typography
                          onClick={() => {
                            setSelectedBooth(booth);
                            setDialogOpen(true);
                          }}
                          style={{ cursor: 'pointer', display: 'inline-block' }}
                        >
                          <h2>{booth.title}</h2>
                        </Typography>
                      </Tooltip>
                      <Typography>{booth.userId.firstName} {booth.userId.lastName}</Typography>
                      <Typography>Date: {dayjs(booth.createdAt).format('MMMM D, YYYY h:mm A')}</Typography>
                      <Box sx={{ position: 'relative', left: '70%', width: '48%', bottom: '102px' }}>
                        <Chip
                          label={
                            booth.status === 'Approved' ? 'Approved' :
                              booth.status === 'Rejected' ? 'Rejected' :
                                'Pending'
                          }
                          variant="outlined"
                          color={
                            booth.status === 'Approved' ? 'success' :
                              booth.status === 'Rejected' ? 'error' :
                                'default'
                          }
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: '48%' }}>
                        {booth.status !== 'Approved' && booth.status !== 'Rejected' && (userType === 'Admin') && (
                          <>
                          <Button
                          onClick={() =>
                            setApproveDialogOpen({ open: true, booth: booth })
                          }
                          variant="contained"
                          style={{ marginRight: '10px'}}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            setRejectDialogOpen({ open: true, booth: booth })
                          }
                          variant="contained"
                        >
                          Reject
                    </Button>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Box sx={{textAlign:'center',position:'relative'}}>
          {booths.filter(booth => booth.exhibitionId === exhibitionId).length === 0 && (
              <Typography variant="h6" style={{ marginTop: '20px'}}>No booths to display</Typography>
            )}
          </Box>

          <Dialog open={approveDialogOpen.open} onClose={() => setApproveDialogOpen({ open: false, booth: null })}>
              <DialogTitle>Approve Booth</DialogTitle>
              <DialogContent dividers>
                <Typography>
                  Are you sure you want to approve this booth? "{approveDialogOpen.booth?.title}"
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setApproveDialogOpen({ open: false, booth: null })} sx={{background:'grey',"&:hover": {
                background: 'grey'
                },}}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} color="primary" autoFocus>
                  Approve
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={rejectDialogOpen.open} onClose={() => setRejectDialogOpen({ open: false, booth: null })}>
              <DialogTitle>Reject Booth</DialogTitle>
              <DialogContent dividers>
                <Typography>
                  Are you sure you want to reject this booth? "{rejectDialogOpen.booth?.title}"
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setRejectDialogOpen({ open: false, booth: null })} sx={{background:'grey',"&:hover": {
                background: 'grey'
                },}}>
                  Cancel
                </Button>
                <Button onClick={handleReject} color="primary" autoFocus>
                  Reject
                </Button>
              </DialogActions>
            </Dialog>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Booth Details
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedBooth && (
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Title: {selectedBooth.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Description: {selectedBooth.description}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Status: {selectedBooth.status}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Date: {dayjs(selectedBooth.createdAt).format('MMMM D, YYYY h:mm A')}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Products
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Name</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                          <TableCell><strong>Type</strong></TableCell>
                          <TableCell><strong>Price</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedBooth.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.productType}</TableCell>
                            <TableCell>{product.currency === 'USD' ? '$' : '₹'}{product.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const SuspenseExhibitionsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExhibitionsPage />
    </Suspense>
  );
};

export default SuspenseExhibitionsPage;
