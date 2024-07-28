

// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   TextField,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// export interface ProductForBooth {
//   productName: string;
//   productDescription: string;
//   productType: string;
//   productPrice: string;
//   currency: string;
//   videourlForproduct?: string;
// }

// interface ProductTableProps {
//   products: ProductForBooth[];
//   productDetails: ProductForBooth[];
//   onRemove: (index: number) => void;
//   onChange: (index: number, updatedProduct: ProductForBooth) => void;
// }

// const ProductTableForBooth: React.FC<ProductTableProps> = ({ products, productDetails, onRemove, onChange }) => {
//   const handleProductChange = (index: number, productName: string) => {
//     const selectedProduct = productDetails.find((product) => product.productName === productName);
//     if (selectedProduct) {
//       onChange(index, selectedProduct);
//     }
//   };

//   const handleInputChange = (index: number, field: keyof ProductForBooth, value: string) => {
//     const updatedProduct = { ...products[index], [field]: value };
//     onChange(index, updatedProduct);
//   };

//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Product Name</TableCell>
//             <TableCell>Product Description</TableCell>
//             <TableCell>Product Type</TableCell>
//             <TableCell>Product Price</TableCell>
//             <TableCell>Currency</TableCell>
//             <TableCell>Video URL</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {products.map((product, index) => (
//             <TableRow key={index}>
//               <TableCell>
//                 <Select
//                   value={product.productName}
//                   onChange={(e) => handleProductChange(index, e.target.value as string)}
//                   displayEmpty
//                   fullWidth
//                 >
//                   <MenuItem value="" disabled>
//                     Select Product
//                   </MenuItem>
//                   {productDetails.map((productDetail, idx) => (
//                     <MenuItem key={idx} value={productDetail.productName}>
//                       {productDetail.productName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={product.productDescription}
//                   onChange={(e) => handleInputChange(index, 'productDescription', e.target.value)}
//                   fullWidth
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={product.productType}
//                   onChange={(e) => handleInputChange(index, 'productType', e.target.value)}
//                   fullWidth
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={product.productPrice}
//                   onChange={(e) => handleInputChange(index, 'productPrice', e.target.value)}
//                   fullWidth
//                 />
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={product.currency}
//                   onChange={(e) => handleInputChange(index, 'currency', e.target.value)}
//                   fullWidth
//                 >
//                   <MenuItem value="INR">INR</MenuItem>
//                   <MenuItem value="USD">USD</MenuItem>
//                   <MenuItem value="EUR">EUR</MenuItem>
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={product.videourlForproduct || ''}
//                   onChange={(e) => handleInputChange(index, 'videourlForproduct', e.target.value)}
//                   fullWidth
//                 />
//               </TableCell>
//               <TableCell>
//                 <IconButton onClick={() => onRemove(index)}>
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default ProductTableForBooth;


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
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ProductForBooth {
  productName: string;
  productDescription: string;
  productType: string;
  productPrice: string;
  currency: string;
  videourlForproduct?: string;
}

interface ProductTableProps {
  products: ProductForBooth[];
  productDetails: ProductForBooth[];
  onRemove: (index: number) => void;
  onChange: (index: number, updatedProduct: ProductForBooth) => void;
}

const ProductTableForBooth: React.FC<ProductTableProps> = ({
  products,
  productDetails,
  onRemove,
  onChange,
}) => {
  const [addingNewProduct, setAddingNewProduct] = useState<boolean[]>(products.map(() => false));

  const handleProductChange = (index: number, productName: string) => {
    const selectedProduct = productDetails.find((product) => product.productName === productName);
    if (selectedProduct) {
      onChange(index, selectedProduct);
    }
  };

  const handleInputChange = (index: number, field: keyof ProductForBooth, value: string) => {
    const updatedProduct = { ...products[index], [field]: value };
    onChange(index, updatedProduct);
  };

  const toggleNewProductMode = (index: number) => {
    const newAddingNewProduct = [...addingNewProduct];
    newAddingNewProduct[index] = !newAddingNewProduct[index];
    setAddingNewProduct(newAddingNewProduct);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Product Description</TableCell>
            <TableCell>Product Type</TableCell>
            <TableCell>Product Price</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Video URL</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>
                {addingNewProduct[index] ? (
                  <TextField
                    value={product.productName}
                    onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                    fullWidth
                    placeholder="Enter product name"
                  />
                ) : (
                  <Select
                    value={product.productName}
                    onChange={(e) => handleProductChange(index, e.target.value as string)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Product
                    </MenuItem>
                    {productDetails.map((productDetail, idx) => (
                      <MenuItem key={idx} value={productDetail.productName}>
                        {productDetail.productName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                <Button onClick={() => toggleNewProductMode(index)}>
                  {addingNewProduct[index] ? 'Cancel' : 'New Product'}
                </Button>
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
                  value={product.productType}
                  onChange={(e) => handleInputChange(index, 'productType', e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={product.productPrice}
                  onChange={(e) => handleInputChange(index, 'productPrice', e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Select
                  value={product.currency}
                  onChange={(e) => handleInputChange(index, 'currency', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  value={product.videourlForproduct || ''}
                  onChange={(e) => handleInputChange(index, 'videourlForproduct', e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTableForBooth;
