import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

interface Product {
  name: string;
  description: string;
  productType: string;
  price: number;
  currency: string;
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
}

interface BoothDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  booth: Booth | null;
  renderVideo: (url: string, width?: number, height?: number) => JSX.Element | null;
}

const BoothDetailsDialog: React.FC<BoothDetailsDialogProps> = ({ open, onClose, booth, renderVideo }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  sx={{ 
        '& .MuiDialog-paper': { 
          maxWidth: '700px',  
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
          <Box>
            <Typography sx={{ position: 'relative', float: 'right' }}>
              {renderVideo(booth.videoUrl, 400, 250)}
            </Typography>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              Title: {booth.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Description: {booth.description}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Status: {booth.status}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Date: {dayjs(booth.createdAt).format('MMMM D, YYYY h:mm A')}
            </Typography>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', position: 'relative', top: '30px' }}>
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
                  {booth.products.map((product, index) => (
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
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoothDetailsDialog;
