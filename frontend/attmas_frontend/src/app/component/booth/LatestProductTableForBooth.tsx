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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AddProductModal2 from "../all_Profile_component/AddProductModal2";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
                    checked={selectedProducts.includes(product._id || '')}
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
        <AddProductModal2
          open={isModalOpen}
          product={selectedProduct}
          onClose={handleClose}
          onSave={() => {}}
          viewOnly={true}
        />
      )}
    </>
  );
};

export default LatestProductTableForBooth;
