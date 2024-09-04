'use client'
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent, Button, Chip, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Avatar } from '@mui/material';
import BoothDetailsModal from '../component/booth/booth';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import ApproveDialog from '../component/approvedilog/approvedilog';
import RemoveDialog from '../component/removedilog/removedilog';
import BoothDetailsDialog from '../component/boothdetailsdilogbox/boothdetailsdilogbox';
import Head from 'next/head';
import IntrestedModal from '../component/booth/intrestedUsers';
import { CommonAvatar } from '../component/common-ui/avatar.component';
import StatusFilter from '../component/filter/filter';
import { DATE_TIME_FORMAT } from '../constants/common.constants';
import { Product } from '../component/all_Profile_component/AddProductModal2';

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
  serverDate: string;
}

interface Visitor {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
  timestamps: string;
  exhibitionId: string;
  userId: string;
  interestType: string;
}


interface Booth {
  _id: string;
  title: string;
  description: string;
  products:  Product[];
  userId: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  status: string;
  exhibitionId: string;
  createdAt: string;
  videoUrl: string;
  rejectComment?: string;
}

const ExhibitionClosedMessage = () => (
  <Box sx={{ textAlign: 'center', padding: '20px' }}>
    <Typography variant="h4">The exhibition is closed</Typography>
    <Typography variant="body1">Sorry, but this exhibition is no longer available.</Typography>
  </Box>
);

const ExhibitionsPage: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isInterestedBtnShow, setIsInterestedBtnShow] = useState<Boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const searchParams = useSearchParams();
  const { userType } = userDetails;
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState<{ open: boolean; booth: Booth | null }>({ open: false, booth: null });
  const [rejectDialogOpen, setRejectDialogOpen] = useState<{ open: boolean; booth: Booth | null }>({ open: false, booth: null });
  const [isParticipateButtonVisible, setParticipateButtonVisible] = useState(true);
  const [hasUserBooth, setHasUserBooth] = useState(false);
  const [view, setView] = useState('boothDetails');
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [interestType, setInterestType] = useState<string>('');



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
        setSelectedExhibition(response.data);
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

        const booths = response.data;

        setBooths(booths);

        const userHasBooth = booths.some((booth: Booth) => booth.exhibitionId === exhibitionId && booth.userId?._id === userDetails?._id);
        setHasUserBooth(userHasBooth);
        setParticipateButtonVisible(!userHasBooth);
      } catch (error) {
        console.error('Error fetching booths:', error);
      }
    };


    const fetchVisitorsforExhibition = async () => {
      try {
        const exhibitionId = searchParams.get('exhibitionId');
        const boothId = searchParams.get('boothId');
        console.log('boothId', boothId)
        if (!exhibitionId) {
          console.error('id not found');
          return;
        }
        const response = await axios.get(`${APIS.GET_VISITORS}`, {
          params: {
            exhibitionId,
            interestType,
            
          },
        });
        console.log('Fetched visitors:', response.data);
        console.log("userDetails._id", userDetails._id);

        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          console.log("element.userId", element.userId);



          if (element.userId === userDetails._id ) {
            setIsInterestedBtnShow(false);
          }
        }

        setVisitors(response.data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };

    fetchExhibitions();
    fetchBooths();
    console.log("view", view);
    if (view === 'boothDetails') {
      fetchVisitorsforExhibition();

    } 

  }, [userDetails?._id, searchParams, statusFilter, view,interestType]);

  useEffect(() => {
    if (interestType) {
      const fetchVisitorforinterestType = async () => {
        try {
          const response = await axios.get(`${APIS.GET_VISITORS_BY_INTEREST_TYPE}`, {
            params: { interestType },
          });
          setVisitors(response.data);
        } catch (error) {
          console.error('Error fetching visitors:', error);
        }
      };
      fetchVisitorforinterestType();
    }
  }, [interestType]);


  const handleInterestTypeChange = (event: any, newInterestType: React.SetStateAction<string> | null) => {
    if (newInterestType !== null) {
      setInterestType(newInterestType);
    }
  };


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
        setParticipateButtonVisible(false);
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

  const handleReject = async (boothId: string, comment: string, _id: string) => {
    try {
      const { booth } = rejectDialogOpen;
      if (!booth) return;
      await axios.post(`${APIS.REJECT_BOOTH}/${booth._id}`, { comment });
      setBooths(prevBooths =>
        prevBooths.map(b =>
          b._id === booth._id ? { ...b, status: 'Rejected', rejectComment: comment } : b
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

  const openInterestedModal = () => setShowInterestedModal(true);
  const closeInterestedModal = () => setShowInterestedModal(false);

  const exhibitionId = searchParams.get('exhibitionId');

  const handleStatusFilterChange = (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => {
    setStatusFilter(newStatus);
  };

  const renderVideo = (url: string, width: number = 710, height: number = 500) => {
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
        <video width={width} height={height} controls>
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <iframe
          width={width}
          height={height}
          style={{ borderRadius: "30px" }}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  };

  const handleViewChange = (event: any, newView: string | null) => {
    if (newView) {
      setView(newView);
    }
  };

  const handleJoinLiveClick = () => {
    if (selectedExhibition && selectedExhibition.meetingUrl) {
      window.open(selectedExhibition.meetingUrl, '_blank');
    }
  };

  const isJoinLiveButtonVisible = (dateTime: string) => {
    const exhibitionDate = dayjs(dateTime).startOf('day');
    const currentDate = dayjs().startOf('day');
    return exhibitionDate.isSame(currentDate);
  };

  const isExhibitionClosed = (exhibition: Exhibition) => exhibition.status === 'close';


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Exhibitions and Booths</title>
      </Head>
      {selectedExhibition === null ? (
        <Typography>Loading exhibition...</Typography>
      ) : isExhibitionClosed(selectedExhibition) ? (
        <ExhibitionClosedMessage />
      ) : (
      <Box sx={{
        display: 'flex', flexDirection: 'column', overflowX: 'hidden', '@media (max-width: 767px)': {
          overflowX: 'hidden'
        }
      }}>
      
        <Box sx={{ position: "relative", color: 'black', textAlign: "left", background: "#f5f5f5", right: "8px", width: "102%", bottom: "15px", height: '6%', padding: '10px' }}>
          <Box sx={{ '@media (max-width: 767px)': { position: 'relative', right: '34px' } }}><h1 style={{ position: 'relative', top: "15%", left: '30px', margin: 0 }}>Exhibition</h1></Box>
          <Box sx={{
            '@media (max-width: 767px)': {
              position: 'relative', left: '72px', top: '10px'

            }
          }}>


            {(userDetails && userType === 'Innovators' && isParticipateButtonVisible) && (
              <Button
                variant="contained"
                color="primary"
                onClick={openModal}
                sx={{
                  position: 'absolute', right: '80px', bottom: '10px', background: '#CC4800', color: 'white', height: '32px', fontWeight: 'bold', '@media (max-width: 767px)': {
                    position: 'absolute', right: '95px'
                  }
                }}
              >
                Participate
              </Button>
            )}


            {(!userType || userType === 'Visitors') && isInterestedBtnShow && (
              <Button
                variant="contained"
                color="primary"
                onClick={openInterestedModal}
                sx={{ position: 'absolute', right: '210px', bottom: '10px', background: '#CC4800', color: 'white', height: '32px', fontWeight: 'bold' }}
              >
                Interested
              </Button>
            )}

            {selectedExhibition && isJoinLiveButtonVisible(selectedExhibition.dateTime) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinLiveClick}
                sx={{ position: 'absolute', right: '330px', bottom: '10px', background: '#CC4800', color: 'white', height: '32px', fontWeight: 'bold' }}
              >
                Webinar
              </Button>
            )}
          </Box>
          <BoothDetailsModal open={showModal} onClose={closeModal} createBooth={handleCreateBooth} exhibitionId={exhibitionId} />
          <IntrestedModal open={showInterestedModal} onClose={closeInterestedModal} exhibitionId={exhibitionId} interestType={'InterestedUserForExhibition'} />
        </Box>
        <div>
          {exhibitions.map((exhibition) => (
            <Box
              key={exhibition._id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <Card sx={{
                flex: 1, marginBottom: '10px', '@media (max-width: 767px)': {
                  marginBottom: '10px', width: '100%',
                  height: 'auto',
                }
              }}>
                <CardContent>
                  {renderVideo(exhibition.videoUrl, window.innerWidth < 768 ? window.innerWidth - 40 : 800, window.innerWidth < 768 ? 200 : 500)}
                </CardContent>
              </Card>
              <Card
                sx={{
                  flex: 1,
                  marginLeft: { xs: '0', sm: '10px' },
                  marginBottom: '20%',
                  '@media (max-width: 767px)': { marginLeft: '-10px', width: '90%' },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'x-large',
                      flexWrap: 'wrap',
                      marginBottom: '20px'
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>
                      {exhibition.title},
                    </Box>
                    <Box
                      sx={{
                        fontSize: 'medium',
                        fontWeight: '400',
                        ml: 2,
                        flexShrink: 0,
                        '@media (max-width: 767px)': {
                          fontSize: 'small',
                          ml: 1,
                        }
                      }}
                    >
                      ({!exhibition.exhbTime ? dayjs(exhibition.dateTime).format(DATE_TIME_FORMAT): exhibition.dateTime} {exhibition.exhbTime || ''})
                    </Box>
                  </Typography>
                  <Typography variant="h5" sx={{ fontSize: 'medium', marginBottom: '10px' }}>{exhibition.description}</Typography>
                  <Typography variant="h5" sx={{ fontSize: 'medium' }}>{exhibition.industries}</Typography>
                  <Typography variant="h5" sx={{ fontSize: 'medium' }}>{exhibition.subjects}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </div>


        <Divider orientation="horizontal" flexItem />
        <div>
          <Box sx={{
            width: '40%', color: 'black', position: 'relative', left: '11%', top: '20px', '@media (max-width: 767px)': {
              position: 'relative',
              width: '100%',
              top: '-10px',
            }
          }}>
            <h1>Booth Details</h1>

            <Box display="flex" justifyContent="center" marginTop="20px" sx={{ position: 'relative', bottom: '62px', left: '40px', '@media (max-width: 767px)': { position: 'relative', bottom: '0px', marginBottom: '20px' } }}>
              {userType !== 'Visitors' && (
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  aria-label="view selection"
                >
                  <ToggleButton value="boothDetails">Booth Details</ToggleButton>
                  {userDetails && userType === 'Admin' ?
                    <ToggleButton value="visitors">Visitors</ToggleButton> : ""}
                </ToggleButtonGroup>
              )}
            </Box>

            {view === 'visitors' && (
              <Box sx={{ position: 'relative', marginBottom: '50px', left: '58%' }}>
                <ToggleButtonGroup
                  value={interestType}
                  exclusive
                  onChange={handleInterestTypeChange}
                  aria-label="interest type selection"
                >
                  
                  <ToggleButton value="InterestedUserForExhibition">Exhibition Visitors</ToggleButton>
                  <ToggleButton value="InterestedUserForBooth">Booth Visitors</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}

          </Box>

          <Box sx={{ position: 'relative', top: '50px', right: '20px', marginBottom: '20px' }}>
            {(userDetails && (userType === 'Admin' || userType === 'Innovators') && view === 'boothDetails') && (
              <StatusFilter value={statusFilter} onChange={handleStatusFilterChange} options={["All", "Pending", "Approved", "Rejected"]} />
            )}
          </Box>


          {view === 'boothDetails' && (
            <>
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
                      <Card sx={{ boxSizing: 'border-box', marginBottom: '10px', height: '100%' }}>
                        <CardContent>
                          <Typography sx={{
                            width: '69%', '@media (max-width: 767px)': {
                              width: '50%'
                            }
                          }}>
                            <h2>{booth.title}</h2>
                          </Typography>
                          {(userDetails && (userType === 'Admin' || userType === 'Innovators')) && (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedBooth(booth);
                              setDialogOpen(true);
                            }}
                            style={{
                              textDecoration: 'underline',
                              color: '#1976d2',
                              fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
                              position: 'relative', float: 'right', bottom: '55px'
                            }}
                          >
                            View Details
                          </a>
                        )}
                          {exhibitions.map((exhibition) => (
                            <Box key={exhibition._id}>
                              {!(userDetails && (userType === 'Admin' || userType === 'Innovators')) &&
                                dayjs(exhibition.dateTime).isSame(dayjs(exhibition.serverDate), 'day') && (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedBooth(booth);
                                      setDialogOpen(true);
                                    }}
                                    style={{
                                      textDecoration: 'underline',
                                      color: '#1976d2',
                                      fontFamily: '"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol" !importent',
                                      position: 'relative', float: 'right', bottom: '55px'
                                    }}
                                  >
                                    View Details
                                  </a>
                                )}
                            </Box>
                          ))}

                          <Typography>{booth.userId.firstName} {booth.userId.lastName}</Typography>
                          <Typography>Date: {dayjs(booth.createdAt).format(DATE_TIME_FORMAT)}</Typography>
                          <Box sx={{
                            position: 'relative', left: '76%', width: '48%', bottom: '45px', '@media (max-width: 767px)': {
                              position: 'relative', top: '-65px', left: '71%'
                            }
                          }}>
                            {(userDetails && (userType === 'Admin' || userType === 'Innovators')) && (
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
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', float: 'left' }}>
                            {booth.status !== 'Approved' && booth.status !== 'Rejected' && (userType === 'Admin') && (
                              <>
                                <Button
                                  onClick={() =>
                                    setApproveDialogOpen({ open: true, booth: booth })
                                  }
                                  variant="contained"
                                  style={{ marginRight: '10px' }}
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
                          <Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                {booths.filter(booth => booth.exhibitionId === exhibitionId).length === 0 && (
                  <Typography variant="h6" style={{ marginTop: '20px' }}>No booths to display</Typography>
                )}
              </Box>
            </>
          )}
          {view === 'visitors' && (
            <Grid container spacing={2} sx={{ padding: '10px', position: 'relative', left: '10%', width: '80%' }}>
              {visitors.map(visitor => (
                <Grid item xs={12} sm={6} md={4} key={visitor._id}>
                  <Card sx={{ maxWidth: 320, height: 200, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CommonAvatar name={`${visitor.firstName} ${visitor.lastName}`} style={{ backgroundColor: 'primary.main', width: 56, height: 56 }}></CommonAvatar>
                      {/* <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                     {visitor.firstName[0]}{visitor.lastName[0]}
                   </Avatar> */}
                      <div>
                        <Typography variant="h6" component="div" gutterBottom >
                          {visitor.firstName} {visitor.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {visitor.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {visitor.mobileNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {visitor.interestType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {dayjs(visitor.timestamps).format('MMMM D, YYYY h:mm A')}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <ApproveDialog
            open={approveDialogOpen.open}
            onClose={() => setApproveDialogOpen({ open: false, booth: null })}
            onApprove={handleApprove}
            booth={approveDialogOpen.booth}
          />
          <RemoveDialog
            open={rejectDialogOpen.open}
            onClose={() => setRejectDialogOpen({ open: false, booth: null })}
            onRemove={async (boothId: string, comment: string) => {
              if (rejectDialogOpen.booth) {
                await handleReject(boothId, comment, rejectDialogOpen.booth._id);
              }
            }}
            booth={rejectDialogOpen.booth}
          />
          {selectedBooth && (
            <BoothDetailsDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              booth={selectedBooth}
              renderVideo={renderVideo}
            />
          )}
        </div>
      </Box>
      )}
    </>
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
