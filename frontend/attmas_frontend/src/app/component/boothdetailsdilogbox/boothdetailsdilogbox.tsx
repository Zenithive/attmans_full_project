import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTubeIcon from '@mui/icons-material/YouTube';
import dayjs from 'dayjs';

interface Product {
  productName: string;
  productDescription: string;
  productType: string;
  price: number;
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

interface BoothDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  booth: Booth | null;
  renderVideo: (url: string, width?: number, height?: number) => JSX.Element | null;
}

const BoothDetailsDialog: React.FC<BoothDetailsDialogProps> = ({ open, onClose, booth, renderVideo }) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

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
             <Box sx={{ position: 'absolute', top: 16, right: 16 ,  '@media (max-width: 767px)': {
              position:'relative',top:'-10px',left:'5px'}}}>
               <Typography variant="body1" color="text.secondary">
                 Status: {booth.status}, Date: {dayjs(booth.createdAt).format('MMMM D, YYYY h:mm A')}
               </Typography>
             </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" component="div" sx={{ mb: 2 ,'@media (max-width: 767px)':{
                  position:'relative',top:'10px'}}}>
                    <Box fontWeight="bold">Title: {booth.title}</Box>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="div" sx={{ mb: 2 ,'@media (max-width: 767px)':{
                    position:'relative',
                  }}}>
                    Description: {booth.description}
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
                            <TableCell>{product.currency === 'USD' ? '$' : '₹'}{product.price}</TableCell>
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
                                  <YouTubeIcon style={{ fontSize: '40px',position:'relative',right:'10px' }}/>
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
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
            '@media (max-width: 767px)':{
              maxWidth:'100%'
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
