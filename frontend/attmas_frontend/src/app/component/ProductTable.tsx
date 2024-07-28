// components/ProductTable.tsx
import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Product {
    productName: string;
    productDescription: string;
    productType: string;
    productPrice: string;
    currency: string;
    videourlForproduct?: string;
}

interface ProductTableProps {
    products: Product[];
    onRemove: (index: number) => void;
    onChange: (index: number, updatedProduct: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onRemove, onChange }) => {
    const handleInputChange = (index: number, field: keyof Product, value: string) => {
        const updatedProduct = { ...products[index], [field]: value };
        onChange(index, updatedProduct);
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
                                <TextField
                                    value={product.currency}
                                    onChange={(e) => handleInputChange(index, 'currency', e.target.value)}
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={product.videourlForproduct
                                        || ''}
                                    onChange={(e) => handleInputChange(index, 'videourlForproduct', e.target.value)}
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    aria-label="remove product"
                                    onClick={() => onRemove(index)}
                                >
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

export default ProductTable;
