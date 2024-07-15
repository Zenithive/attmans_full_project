'use client'
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent, Button, Chip, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BoothDetailsModal from '../component/booth/booth';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

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
  products: { name: string; description: string; productType: string; price: number; }[];
  userId: {
    firstName: string;
    lastName: string;
  };
  status: string;
  exhibitionId: string;
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

  const handleApprove = async (boothId: string) => {
    try {
      await axios.post(`${APIS.APPROVE_BOOTH}/${boothId}`);
      setBooths(prevBooths =>
        prevBooths.map(booth =>
          booth._id === boothId ? { ...booth, status: 'Approved' } : booth
        )
      );
      setStatusFilter('Approved'); 
    } catch (error) {
      console.error('Error approving booth:', error);
    }
  };

  const handleReject = async (boothId: string) => {
    try {
      await axios.post(`${APIS.REJECT_BOOTH}/${boothId}`);
      setBooths(prevBooths =>
        prevBooths.map(booth =>
          booth._id === boothId ? { ...booth, status: 'Rejected' } : booth
        )
      );
      setStatusFilter('Rejected');
    } catch (error) {
      console.error('Error rejecting booth:', error);
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
        <div style={{ position: "relative", color: 'black', textAlign: "center", background: "#f5f5f5", right: "8px", width: "102%", bottom: "29px" }}>
          <h1 style={{ position: 'relative', top: "15%" }}>Exhibition</h1>
          {(userDetails && userType === 'Innovators') && (
            <Button variant="contained" color="primary" onClick={openModal} style={{ position: 'relative', float: "right", bottom: '60px', right: '5%', background: '#757575', fontWeight: 'bolder', color: 'white', height: '32px',backgroundColor:'#CC4800' }}>
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
          <Box sx={{ width: '40%', color: 'black', position: 'relative', left: '11%',top:'20px' }}>
            <h1>Booth Details</h1>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              aria-label="status filter"
              sx={{position:'relative',left:'40%',bottom:'63px'}}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '10px', position: 'relative', left: '10%', width: '80%' }}>
            {booths
                .filter(booth => booth.exhibitionId === exhibitionId)
                .filter(booth => userType === 'Innovators' || userType === 'Admin' || booth.status === 'Approved')
              .map(booth => (
                <Card key={booth._id} sx={{ flex: '1 1 calc(33.333% - 10px)', boxSizing: 'border-box', marginBottom: '10px' }}>
                  <CardContent>
                    <Typography
                      onClick={() => {
                        setSelectedBooth(booth);
                        setDialogOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {booth.title}
                    </Typography>
                    <Typography>{booth.userId.firstName} {booth.userId.lastName}</Typography>
                    <Box sx={{ position: 'relative', left: '70%', width: '48%', bottom: '24px' }}>
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
                    <Typography>Products:- </Typography>
                    <Typography>
                      <ul>
                        {booth.products.map(product => (
                          <div key={product.name} style={{ margin: '20px' }}>
                            <li>
                              {product.name} <br />
                              {product.description} <br />
                              {product.productType} <br />
                              {product.price}
                            </li>
                          </div>
                        ))}
                      </ul>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: '48%' }}>
                      {booth.status !== 'Approved' && booth.status !== 'Rejected' && (userType === 'Admin') &&  (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleApprove(booth._id)}
                            disabled={booth.status === 'Approved' || booth.status === 'Rejected'}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleReject(booth._id)}
                            disabled={booth.status === 'Approved' || booth.status === 'Rejected'}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            {selectedBooth && (
              <>
                <DialogTitle><h1>Booth Details</h1></DialogTitle>
                <DialogContent>
                <Typography><h2>Title :- {selectedBooth.title}</h2></Typography>
                  <Typography><h2>Description :- {selectedBooth.description}</h2></Typography>
                  <Typography><h2>Status :- {selectedBooth.status}</h2></Typography>
                  <Typography><h2>Products :- </h2></Typography>
                  <Typography>
                      <ul>
                        {selectedBooth.products.map(product => (
                          <div key={product.name} style={{ margin: '20px' }}>
                            <li><h2>
                              {product.name} <br />
                              {product.description} <br />
                              {product.productType} <br />
                              {product.price}
                              </h2></li>
                          </div>
                        ))}
                      </ul>
                    </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
              </>
            )}
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
