import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CurrencyPriceInput from './CurrencyPriceInput';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface ProductForBooth {
  _id?: string;
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  currency: string;
  videourlForproduct?: string;
  productQuantity: number;
  stageofdevelopmentdropdown: string;
  targetaudience: string;
  problemaddressed: string;
  technologyused: string;
  intellectualpropertyconsiderations: string;
  CompetitiveAdvantages: string;
  feasibilityofthesolution: string;
  howdoesthesolutionwork: string;
  potentialbenefits: string;
  challengesorrisks: string;
  productType?: string;
}

interface ProductTableProps {
  products: ProductForBooth[];
  productDetails?: ProductForBooth[]; 
  onRemove: (index: number) => void;
  onChange: (index: number, updatedProduct: ProductForBooth) => void;
}

const ProductTableForBooth: React.FC<ProductTableProps> = ({
  products,
  onRemove,
  onChange,
}) => {
  console.log('Products in ProductTableForBooth:', products);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewProduct, setViewProduct] = useState<ProductForBooth | null>(null);

  const handleCheckboxChange = (index: number) => {
    setSelectedProducts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleViewClick = (product: ProductForBooth) => {
    setViewProduct(product);
  };

  const handleCloseModal = () => {
    setViewProduct(null);
  };

  const handleInputChange = (index: number, field: keyof ProductForBooth, value: any) => {
    const updatedProduct = { ...products[index], [field]: value };
    onChange(index, updatedProduct);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stage of Development</TableCell>
              <TableCell>Product Price</TableCell>
              <TableCell>Video URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    color='secondary'
                    checked={selectedProducts.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={product.productName}
                    onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={product.productDescription}
                    onChange={(e) => handleInputChange(index, 'productDescription', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={product.productQuantity}
                    onChange={(e) => handleInputChange(index, 'productQuantity', +e.target.value)}
                    fullWidth
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={product.stageofdevelopmentdropdown}
                    onChange={(e) => handleInputChange(index, 'stageofdevelopmentdropdown', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <CurrencyPriceInput
                    price={product.productPrice}
                    currency={product.currency}
                    onPriceChange={(value) => handleInputChange(index, 'productPrice', +value)}
                    onCurrencyChange={(value) => handleInputChange(index, 'currency', value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={product.videourlForproduct || ''}
                    onChange={(e) => handleInputChange(index, 'videourlForproduct', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewClick(product)}>
                    <VisibilityIcon />
                  </IconButton>
                  <Button onClick={() => onRemove(index)} color="error">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!viewProduct} onClose={handleCloseModal}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {viewProduct && (
            <div>
              <Typography variant="h6">Product Name:</Typography>
              <Typography>{viewProduct.productName}</Typography>
              <Typography variant="h6">Product Description:</Typography>
              <Typography>{viewProduct.productDescription}</Typography>
              <Typography variant="h6">Quantity:</Typography>
              <Typography>{viewProduct.productQuantity}</Typography>
              <Typography variant="h6">Stage of Development:</Typography>
              <Typography>{viewProduct.stageofdevelopmentdropdown}</Typography>
              <Typography variant="h6">Product Price:</Typography>
              <Typography>{viewProduct.productPrice} {viewProduct.currency}</Typography>
              <Typography variant="h6">Video URL:</Typography>
              <Typography>{viewProduct.videourlForproduct}</Typography>
              {/* Add additional details as needed */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTableForBooth;
