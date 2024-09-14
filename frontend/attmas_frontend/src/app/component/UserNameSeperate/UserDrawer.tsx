import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, IconButton, Drawer
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductTable, { Product } from '../ProductTable';
import { ProductForBooth } from '../ProductTableForBooth';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import axiosInstance from '@/app/services/axios.service';
import NewProductTable from '../all_Profile_component/NewProductTable';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  Headline: string;
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
  username: string;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ open, onClose, username }) => {


  const [productDetails, setProductDetails] = useState<ProductForBooth[]>([]);
  const [user, setUser] = useState<User>({} as User);

  const convertToProductForBooth = (product: Product): ProductForBooth => {
    return {
      id: product.id,
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice ?? 0, // Use productPrice if available, otherwise default to 0
      currency: product.currency,
      videourlForproduct: product.videourlForproduct,
      productQuantity: product.productQuantity ?? 0, // Use productQuantity if available, otherwise default to 0
      targetaudience: product.targetaudience??'',
      problemaddressed: product.problemaddressed??'',
      technologyused: product.technologyused??'',
      stageofdevelopmentdropdown: product.stageofdevelopmentdropdown ?? '', // Use value if available
      intellectualpropertyconsiderations: product.intellectualpropertyconsiderations?? '',
      CompetitiveAdvantages: product.CompetitiveAdvantages?? '',
      feasibilityofthesolution: product.feasibilityofthesolution??'',
      howdoesthesolutionwork: product.howdoesthesolutionwork??'',
      potentialbenefits: product.potentialbenefits??'',
      challengesorrisks: product.challengesorrisks??'',
    };
  };
  

  useEffect(() => {
    fetchProductDetailsForUser();
  }, [user.username])

  useEffect(() => {
    if (username) {
      fetchUserDetailsUsingUsername();
    }
  }, [username])

  const fetchProductDetailsForUser = async () => {
    try {
      const response = await axiosInstance.get<ProductForBooth[]>(
        `${APIS.PRODUCTNAME}?username=${user.username}`
      );
      setProductDetails(response.data || []);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchUserDetailsUsingUsername = async () => {
    try {
      const response = await axiosInstance.get<User[]>(
        `/users/filters?&page=1&limit=20&username=${username}`
      );
      console.log('profile for',response.data)
      setUser(response.data[0] || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const productArray: Product[] = productDetails.map(convertToProductForBooth);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1300 }}
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
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth

              sx={{ width: "50%" }}
            />

            <TextField
              label="Email"
              value={user.username}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth

              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Mobile Number"
              value={user.mobileNumber}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"

              fullWidth
              sx={{ width: "50%" }}
            />

            <TextField
              label="User Type"
              value={user.userType}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth

              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Sector"
              value={user.sector}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"

              fullWidth
              sx={{ width: "50%" }}
            />

            <TextField
              label="Organization"
              value={user.organization}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth

              sx={{ width: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Preferred Category"
              value={user?.categories?.join(', ')}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              multiline
              fullWidth

            />

            <TextField
              label="Subject Matter Expertise "
              value={user?.subcategories?.join(', ')}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              multiline
            />
          
          </Box>
          <Box sx={{marginBottom:'20px'}}>
          <TextField
              label="Headline"
              multiline
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              color="secondary"
              fullWidth
              rows={5}
            />
          </Box>
          {user.userType === 'Innovator' && (
            <NewProductTable
              products={productArray} onView={function (product: Product): void {
                throw new Error('Function not implemented.');
              } } onEdit={function (product: Product): void {
                throw new Error('Function not implemented.');
              } } onDelete={function (id: string): void {
                throw new Error('Function not implemented.');
              } }    
              hideActions={true}          
              
            />
          )}
        </>
      </div>
    </Drawer>
  );
};

export default UserDrawer;
