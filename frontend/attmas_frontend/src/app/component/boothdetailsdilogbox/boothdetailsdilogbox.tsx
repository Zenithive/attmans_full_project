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
import { APIS } from '@/app/constants/api.constant';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import InterestedModal from '../booth/intrestedUsers';

interface Product {
  productName: string;
  productDescription: string;
  productType: string;
  productPrice: number;
  currency: string;
  videourlForproduct: string;
}

interface Booth {
  _id: string;
  title: string;
  description: string;
  products: Product[];
  userId: {
    firstName: string;
    lastName: string;
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
  userId:string;
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
  const [isInterestedBtnShows, setIsInterestedBtnShows] = useState<Boolean>(true);



  
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const boothId = booth?._id;
        const exhibitionId = searchParams.get('exhibitionId');
        if (!boothId || !exhibitionId) {
          console.error('Booth ID or Exhibition ID not found');
          return;
        }

        const response = await axios.get(`${APIS.GET_BOOTH_VISITORS_BY_EXHIBITION}`, {
          params: {
            boothId,
            exhibitionId,
          },
        });

        console.log('Fetched visitors:', response.data);

        if (response.data.some((visitor: Visitor) => visitor.userId === userDetails._id)) {
          setIsInterestedBtnShows(false);
        }

        setVisitors(response.data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };

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

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ 
        '& .MuiDialog-paper': { 
          maxWidth: '100%', 
          maxHeight:'100%'
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
                <Typography variant="body1" sx={{'@media (max-width: 767px)': {fontSize:'1.25rem'}}} color="text.secondary">
                  Status: {booth.status}, Date: {dayjs(booth.createdAt).format('MMMM D, YYYY h:mm A')}
                </Typography>
                <Box sx={{position:'relative',right:'45%',top:'15px'}}>
                {(!userDetails.userType || userDetails.userType === 'Visitors') && isInterestedBtnShows && (
              <Button
                variant="contained"
                color="primary"
                onClick={openInterestedModals}
                sx={{ position: 'absolute', right: '210px', bottom: '10px', background: '#CC4800', color: 'white', height: '32px', fontWeight: 'bold' }}
              >
                Interested
              </Button>
            )}
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="div" sx={{ mb: 2, '@media (max-width: 767px)': { position: 'relative', top: '10px' } }}>
                    <Box fontWeight="bold">Title: {booth.title}</Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"  sx={{ mb: 2 ,fontSize:'1.25rem', '@media (max-width: 767px)': { position: 'relative',fontSize:'1.25rem' } }}>
                  <strong>Description: </strong>{booth.description}
                  </Typography>
                </Grid>
                {booth.rejectComment && (
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
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Video</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {booth.products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>{product.productName}</TableCell>
                              <TableCell>{product.productDescription}</TableCell>
                              <TableCell>{product.productType}</TableCell>
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
                                  <IconButton color="secondary" onClick={() => handleVideoOpen(product.videourlForproduct)}>
                                    <YouTubeIcon style={{ fontSize: '40px', position: 'relative' }} />
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
                      <Card key={index} sx={{ mb: 2}}>
                        <CardContent>
                          <Typography variant="body1" sx={{marginBottom:'15px', fontSize:'1.25rem'}}><strong>Name:</strong> {product.productName}</Typography>
                          <Typography variant="body1" sx={{marginBottom:'15px',fontSize:'1.25rem'}}><strong>Description:</strong> {product.productDescription}</Typography>
                          <Typography variant="body1" sx={{fontSize:'1.25rem'}}><strong>Type:</strong> {product.productType}</Typography>
                          <Typography variant="body1" sx={{fontSize:'1.25rem'}}><strong>Price:</strong> {product.currency === 'USD' ? '$' : '₹'}{product.productPrice}</Typography>
                          <Box sx={{ mt: 1 ,'@media (max-width: 767px)': {
                        position: 'relative',
                        float: 'right',
                        bottom: '45px'}}}>
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
                              <IconButton color="secondary" onClick={() => handleVideoOpen(product.videourlForproduct)}>
                                <YouTubeIcon style={{ fontSize: '40px', position: 'relative' }} />
                              </IconButton>
                            </Tooltip>
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
    </>
  );
};

export default BoothDetailsDialog;
