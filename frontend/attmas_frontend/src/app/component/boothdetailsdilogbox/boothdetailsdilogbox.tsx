import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Grid,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTubeIcon from '@mui/icons-material/YouTube';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import InterestedModal from '../booth/intrestedUsers';
import { DATE_TIME_FORMAT } from '@/app/constants/common.constants';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddProductModal2, { Product } from '../all_Profile_component/AddProductModal2';
import axiosInstance from '@/app/services/axios.service';
import { pubsub } from '@/app/services/pubsub.service';
import UserDrawer from '../UserNameSeperate/UserDrawer';


interface Booth {
  _id: string;
  title: string;
  description: string;
  products: Product[];
  userId: {
    firstName: string;
    lastName: string;
    username?: string;
  };
  status: string;
  exhibitionId: string;
  createdAt: string;
  videoUrl: string;
  rejectComment?: string;
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


interface BoothDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  booth: Booth | null;
  renderVideo: (url: string, width?: number, height?: number) => JSX.Element | null;
}

const BoothDetailsDialog: React.FC<BoothDetailsDialogProps> = ({ open, onClose, booth, renderVideo }) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [showInterestedModals, setShowInterestedModals] = useState(false);
  const [view, setView] = useState('boothDetails');
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const searchParams = useSearchParams();
  const [isBoothInterestedBtnVisible, setIsBoothInterestedBtnVisible] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchVisitors = async () => {
    try {
      setIsBoothInterestedBtnVisible(true);
      const boothId = booth?._id;
      const exhibitionId = searchParams.get('exhibitionId');
      if (!boothId || !exhibitionId) {
        console.error('Booth ID or Exhibition ID not found');
        return;
      }

      const response = await axiosInstance.get(`/interested-users/booth-visitors-by-exhibition`, {
        params: {
          boothId,
          exhibitionId,
        },
      });

      const hasUserShownInterest = response.data.some(
        (visitor: Visitor) => visitor.userId === userDetails._id && visitor.interestType === 'InterestedUserForBooth'
      );


      if (hasUserShownInterest) {
        console.log('Condition met: user has shown interest in booth');
        setIsBoothInterestedBtnVisible(false);
      }

      setVisitors(response.data);

    } catch (error) {
      console.error('Error fetching booth visitors:', error);
    }

  };

  useEffect(() => {
    pubsub.subscribe('VisitorUpdated', fetchVisitors);
    return () => {
      pubsub.unsubscribe('VisitorUpdated', fetchVisitors);
    };
  }, [fetchVisitors]);


  useEffect(() => {

    if (view === 'boothDetails') {
      fetchVisitors();
    }
  }, [userDetails._id, searchParams, view, booth?._id]);


  const openInterestedModals = () => setShowInterestedModals(true);
  const closeInterestedModals = () => setShowInterestedModals(false);

  const exhibitionId = searchParams.get('exhibitionId');


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));




  const handleVideoOpen = (url: string) => {
    setSelectedVideoUrl(url);
    setVideoOpen(true);
  };

  const handleVideoClose = () => {
    setVideoOpen(false);
    setSelectedVideoUrl(null);
  };

  const handleUserClick = (username: string) => {
    setSelectedUser(username || '');
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{
        '& .MuiDialog-paper': {
          maxWidth: '100%',
          maxHeight: '100%'
        }
      }}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Booth Details
          <IconButton
            aria-label="close"
            onClick={onClose}
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
          {booth && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, '@media (max-width: 767px)': { position: 'relative', top: '-10px', left: '5px' } }}>
                <Typography variant="body1" sx={{ '@media (max-width: 767px)': { fontSize: '1.25rem' } }} color="text.secondary">
                  Date: {dayjs(booth.createdAt).format(DATE_TIME_FORMAT)}
                </Typography>
                <Typography variant="body1" sx={{ '@media (max-width: 767px)': { fontSize: '1.25rem' } }} color="text.secondary">
                  Status: {booth.status}
                </Typography>
                <Box sx={{ position: 'relative', right: '45%', top: '15px' }}>
                  {(!userDetails.userType || userDetails.userType === 'Visitors') && isBoothInterestedBtnVisible && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (!userDetails._id) {
                          openInterestedModals(); // Open modal if userId is not present
                        } else {
                          console.log('User details already present, modal will not open');
                          openInterestedModals();
                        }
                      }}
                      sx={{ position: 'absolute', right: '210px', bottom: '10px', background: '#CC4800', color: 'white', height: '32px', fontWeight: 'bold' }}
                    >
                      Interested
                    </Button>
                  )}
                </Box>
                {userDetails.userType === 'Admin' && <Typography
                  variant="body2"
                  sx={{
                    cursor: 'pointer',
                    color: '#0000FF', 
                    textDecoration: 'underline', 
                  }}
                  onClick={() => handleUserClick(booth?.userId?.username || "")}
                >
                  {booth.userId.firstName} {booth.userId.lastName}
                </Typography>}


              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div" sx={{ mb: 2, '@media (max-width: 767px)': { position: 'relative', top: '10px' } }}>
                    <Box fontWeight="bold">Title: {booth.title}</Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 2, fontSize: '1.25rem',wordBreak: 'break-word',
                    whiteSpace: 'normal', '@media (max-width: 767px)': { position: 'relative', fontSize: '1.25rem' } }}>
                    <strong>Description: </strong>{booth.description}
                  </Typography>
                </Grid>
                {booth.rejectComment && booth.userId.username === userDetails.username &&(
                  <Grid item xs={12}>
                    <Box sx={{ borderRadius: '5px', backgroundColor: 'error.light', p: 2 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'white' }}>
                        <b>Rejection Comment:</b> {booth.rejectComment}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Products
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {!isMobile ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Stage Of Development</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Video</strong></TableCell>
                            <TableCell><strong>Action</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {booth.products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>{product.productName}</TableCell>
                              <TableCell>{product.productDescription}</TableCell>
                              <TableCell>{product.productQuantity}</TableCell>
                              <TableCell>{product.stageofdevelopmentdropdown}</TableCell>
                              <TableCell>{product.currency === 'USD' ? '$' : '₹'}{product.productPrice}</TableCell>
                              <TableCell>
                                <Tooltip
                                  title="Play Video"
                                  placement="top"
                                  arrow
                                  PopperProps={{
                                    modifiers: [
                                      {
                                        name: 'offset',
                                        options: {
                                          offset: [0, -10],
                                        },
                                      },
                                    ],
                                  }}
                                >
                                  <IconButton color="secondary" onClick={() => handleVideoOpen(product?.videourlForproduct || '')}>
                                    <YouTubeIcon style={{ fontSize: '40px', position: 'relative' }} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title="View Details" placement="top" arrow>
                                  <IconButton>
                                    <VisibilityIcon onClick={() => handleViewProduct(product)} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    booth.products.map((product, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="body1" sx={{ marginBottom: '15px', fontSize: '1.25rem' }}><strong>Name:</strong> {product.productName}</Typography>
                          <Typography variant="body1" sx={{ marginBottom: '15px', fontSize: '1.25rem' }}><strong>Description:</strong> {product.productDescription}</Typography>
                          <Typography variant="body1" sx={{ fontSize: '1.25rem' }}><strong>Price:</strong> {product.currency === 'USD' ? '$' : '₹'}{product.productPrice}</Typography>
                          <Box sx={{
                            mt: 1, '@media (max-width: 767px)': {
                              position: 'relative',
                              float: 'right',
                              bottom: '45px'
                            }
                          }}>
                            <Tooltip
                              title="Play Video"
                              placement="top"
                              arrow
                              PopperProps={{
                                modifiers: [
                                  {
                                    name: 'offset',
                                    options: {
                                      offset: [0, -10],
                                    },
                                  },
                                ],
                              }}
                            >
                              <IconButton color="secondary" onClick={() => handleVideoOpen(product.videourlForproduct || '')}>
                                <YouTubeIcon style={{ fontSize: '40px', position: 'relative' }} />
                              </IconButton>
                            </Tooltip>
                            <TableCell sx={{display:'flex',float:'left',paddingTop:'6px'}}>
                                <Tooltip title="View Details" placement="top" arrow>
                                  <IconButton>
                                    <VisibilityIcon onClick={() => handleViewProduct(product)} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Grid>
              </Grid>
              <InterestedModal open={showInterestedModals} onClose={closeInterestedModals} exhibitionId={exhibitionId} boothId={booth._id} interestType={'InterestedUserForBooth'} />
            </Box>
          )}
          <AddProductModal2
            open={modalOpen}
            onClose={handleCloseModal}
            onSave={() => { }}
            product={selectedProduct}
            viewOnly={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={videoOpen} onClose={handleVideoClose} maxWidth="md" fullWidth sx={{
        '& .MuiDialog-paper': {
          '@media (max-width: 767px)': {
            maxWidth: '100%'
          }
        }
      }}>
        <DialogTitle>
          Product Video
          <IconButton
            aria-label="close"
            onClick={handleVideoClose}
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
          {selectedVideoUrl && (
            <Box sx={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              justifyContent: 'center',
              '@media (max-width: 767px)': {
                width: '100%',
                height: 'auto',
              },
            }}>
              {renderVideo(selectedVideoUrl, window.innerWidth < 768 ? window.innerWidth - 40 : 850, window.innerWidth < 768 ? 200 : 500)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVideoClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {selectedUser && (
        <UserDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          username={selectedUser}
        />
      )}
    </>
  );
};

export default BoothDetailsDialog;
