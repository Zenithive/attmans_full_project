import React from 'react';
import {
  Box, Typography, TextField, IconButton, Drawer
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductTable, { Product } from '../ProductTable';
import { ProductForBooth } from '../ProductTableForBooth';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  username: string;
  userType: string;
  personalProfilePhoto?: string;
  categories: string[];
  subcategories: string[];
  sector: string;
  organization: string;
}

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  productDetails: ProductForBooth[];
  setProductDetails: React.Dispatch<React.SetStateAction<ProductForBooth[]>>;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ open, onClose, user, productDetails, setProductDetails }) => {
  if (!user) return null;

  const convertToProductForBooth = (product: Product): ProductForBooth => {
    return {
      id: product.id, // Ensure id is handled correctly
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: 0,
      currency: product.currency,
      videourlForproduct: product.videourlForproduct,
      productQuantity: 0, // Provide a default value or handle this appropriately
      targetaudience: '',
      problemaddressed: '',
      technologyused: '',
      stageofdevelopmentdropdown: '',
      intellectualpropertyconsiderations: '',
      CompetitiveAdvantages: '',
      feasibilityofthesolution: '',
      howdoesthesolutionwork: '',
      potentialbenefits: '',
      challengesorrisks: '',
      productType: '' // Provide a default value or handle this appropriately
    };
  };

  const productArray: Product[] = productDetails.map(convertToProductForBooth);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px 0px 0px 20px",
          width: "800px",
          p: 2,
          backgroundColor: "#f9f9f9",
          "@media (max-width: 767px)": {
            width: "100%",
          },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <div style={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: "-6px", right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
            Detailed Information
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="User Name"
              value={`${user.firstName} ${user.lastName}`}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
              sx={{ width: "50%" }}
            />

            <TextField
              label="Email"
              value={user.username}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Mobile Number"
              value={user.mobileNumber}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              disabled
              fullWidth
              sx={{ width: "50%" }}
            />

            <TextField
              label="User Type"
              value={user.userType}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Sector"
              value={user.sector}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              disabled
              fullWidth
              sx={{ width: "50%" }}
            />

            <TextField
              label="Organization"
              value={user.organization}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Categories"
              value={user.categories.join(', ')}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
            />

            <TextField
              label="Subcategories"
              value={user.subcategories.join(', ')}
              InputProps={{ readOnly: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
            />
          </Box>

          {user.userType === 'Innovators' && (
            <ProductTable
              products={productArray}
              onRemove={(index) => {
                const updatedProducts = productArray.filter((_, i) => i !== index);
                setProductDetails(
                    updatedProducts.map(product => convertToProductForBooth(product))
                );
              }}
              onChange={(index, updatedProduct) => {
                const updatedProducts = productArray.map((product, i) =>
                  i === index ? updatedProduct : product
                );
                setProductDetails(
                    updatedProducts.map(product => convertToProductForBooth(product))
                );
              }}
              showActions={false}
              readOnly={true}
            />
          )}
        </>
      </div>
    </Drawer>
  );
};

export default UserDrawer;
