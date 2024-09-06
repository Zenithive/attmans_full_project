
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Product } from "../ProductTable";



interface ProductTableForBoothProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (product: Product) => void;
}

const LatestProductTableForBooth: React.FC<ProductTableForBoothProps> = ({
  products,
  selectedProducts,
  onProductSelect,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price: number, currency: string) => {
    return currency === "INR" ? `₹ ${price}` : `$ ${price}`;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Product Price</TableCell>
              <TableCell>Stage of Development</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="secondary"
                    checked={selectedProducts.includes(product?._id || '')}
                    onChange={() => onProductSelect(product)}
                    inputProps={{ "aria-labelledby": `product-${product._id}` }}
                  />
                </TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productDescription}</TableCell>
                <TableCell>{product.productQuantity}</TableCell>
                <TableCell>{formatPrice(product.productPrice, product.currency)}</TableCell>
                <TableCell>{product.stageofdevelopmentdropdown}</TableCell>
                <TableCell>
                  {product.videourlForproduct && (
                    <IconButton
                      component="a"
                      href={product.videourlForproduct}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YouTubeIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedProduct && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              width: '70%',
              maxWidth: 800,
              margin: "auto",
              mt: 4,
              p: 4,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {selectedProduct.productName}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {selectedProduct.productDescription}
            </Typography>
            <Typography variant="body1">
              <strong>Price:</strong> {formatPrice(selectedProduct.productPrice, selectedProduct.currency)}
            </Typography>
            <Typography variant="body1">
              <strong>Quantity:</strong> {selectedProduct.productQuantity}
            </Typography>
            <Typography variant="body1">
              <strong>Stage of Development:</strong> {selectedProduct.stageofdevelopmentdropdown}
            </Typography>
            <Typography variant="body1">
              <strong>Target Audience:</strong> {selectedProduct.targetaudience}
            </Typography>
            <Typography variant="body1">
              <strong>Problem Addressed:</strong> {selectedProduct.problemaddressed}
            </Typography>
            <Typography variant="body1">
              <strong>Technology Used:</strong> {selectedProduct.technologyused}
            </Typography>
            <Typography variant="body1">
              <strong>Intellectual Property:</strong> {selectedProduct.intellectualpropertyconsiderations}
            </Typography>
            <Typography variant="body1">
              <strong>Competitive Advantages:</strong> {selectedProduct.CompetitiveAdvantages}
            </Typography>
            <Typography variant="body1">
              <strong>Feasibility:</strong> {selectedProduct.feasibilityofthesolution}
            </Typography>
            <Typography variant="body1">
              <strong>Solution Work:</strong> {selectedProduct.howdoesthesolutionwork}
            </Typography>
            <Typography variant="body1">
              <strong>Potential Benefits:</strong> {selectedProduct.potentialbenefits}
            </Typography>
            <Typography variant="body1">
              <strong>Challenges/Risks:</strong> {selectedProduct.challengesorrisks}
            </Typography>
            <Typography variant="body1">
              <strong>Video:</strong> 
              <IconButton
                component="a"
                href={selectedProduct.videourlForproduct}
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </IconButton>
            </Typography>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default LatestProductTableForBooth;
