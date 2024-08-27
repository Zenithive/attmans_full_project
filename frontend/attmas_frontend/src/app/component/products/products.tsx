import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Product {
  name: string;
  description: string;
  productType: string;
  price: number;
}

interface MyProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const MyProducts: React.FC<MyProductsProps> = ({ products, setProducts }) => {
  const [product, setProduct] = useState<Product>({ name: '', description: '', productType: '', price: 0 });

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    setProducts(prevState => [...prevState, product]);
    setProduct({ name: '', description: '', productType: '', price: 0 });
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(prevState => prevState.filter((_, i) => i !== index));
  };

  return (
    <>
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
          {Array.isArray(products) && products.map((product, index) => (
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
    </>
  );
};

export default MyProducts;
