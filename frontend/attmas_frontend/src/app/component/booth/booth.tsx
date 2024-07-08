import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface BoothDetailsModalProps {
  open: boolean;
  onClose: () => void;
  createBooth: (data: any) => void;
}

interface Product {
  name: string;
  description: string;
  productType: string;
  price: number;
}

const BoothDetailsModal: React.FC<BoothDetailsModalProps> = ({ open, onClose, createBooth }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const initialBoothDetails = {
    title: '',
    description: '',
    videoUrl: '',
    products: [] as Product[],
    userId: userDetails._id,
  };

  const [boothDetails, setBoothDetails] = useState(initialBoothDetails);
  const [product, setProduct] = useState<Product>({ name: '', description: '', productType: '', price: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBoothDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    setBoothDetails(prevState => ({
      ...prevState,
      products: [...prevState.products, product],
    }));
    setProduct({ name: '', description: '', productType: '', price: 0 });
  };

  const handleRemoveProduct = (index: number) => {
    setBoothDetails(prevState => ({
      ...prevState,
      products: prevState.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      await createBooth(boothDetails);
      setBoothDetails({
        title: '',
        description: '',
        videoUrl: '',
        products: [],
        userId: userDetails._id,
      });
      setProduct({ name: '', description: '', productType: '', price: 0 });
      onClose();
    } catch (error) {
      console.error('Error creating booth:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          bgcolor: 'white',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
          maxHeight: '90vh',
          borderRadius:'20px',
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Booth Details
        </Typography>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={boothDetails.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={boothDetails.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Video URL"
          name="videoUrl"
          value={boothDetails.videoUrl}
          onChange={handleChange}
          margin="normal"
        />

        <Typography variant="h6" component="h2" style={{ marginTop: '20px' }}>
          Products
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>ProductType</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boothDetails.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProduct(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleProductChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  label="Product Description"
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  label="Product Type"
                  name="productType"
                  value={product.productType}
                  onChange={handleProductChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  label="Product Price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleProductChange}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={handleAddProduct}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default BoothDetailsModal;
