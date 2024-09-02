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
import CurrencyPriceInput from './CurrencyPriceInput';
// import { ProductForBooth } from './ProductTableForBooth';

export interface Product {
    id: string;
    productName: string;
    productDescription: string;
    productPrice: number; // Ensure this is a number
    currency: string;
    videourlForproduct?: string;
    productQuantity: number;
    targetaudience: string;
    problemaddressed: string;
    technologyused: string;
    stageofdevelopmentdropdown: string;
    intellectualpropertyconsiderations: string;
    CompetitiveAdvantages: string;
    feasibilityofthesolution: string;
    howdoesthesolutionwork: string;
    potentialbenefits: string;
    challengesorrisks: string;
}

interface ProductTableProps {
    products: Product[];
    onRemove: (index: number) => void;
    onChange: (index: number, updatedProduct: Product) => void;
    showActions?: boolean; 
    readOnly?: boolean; // Add this prop
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onRemove, onChange, showActions = true, readOnly = false }) => {
    const handleInputChange = (index: number, field: keyof Product, value: string) => {
        if (readOnly) return; // Skip if readOnly is true
        const updatedProduct = { ...products[index], [field]: value };
        onChange(index, updatedProduct);
    };

    const handleCurrencyPriceChange = (index: number, field: keyof Product, value: string) => {
        if (readOnly) return; // Skip if readOnly is true
        const updatedProduct = { ...products[index], [field]: value };
        onChange(index, updatedProduct);
    };

    const handlePriceCurrencyChange = (index: number, value: string) => {
        if (readOnly) return; // Skip if readOnly is true
        const [currency, ...priceParts] = value.split(' ');
        const productPrice = parseFloat(priceParts.join(' ')); // Convert to number
        const updatedProduct = { ...products[index], currency, productPrice };
        onChange(index, updatedProduct);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Product Description</TableCell>
                        <TableCell>Product Price</TableCell>
                        <TableCell>Video URL</TableCell>
                        {showActions && !readOnly && <TableCell>Actions</TableCell>}
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
                                    InputProps={{ readOnly: readOnly }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    multiline
                                    value={product.productDescription}
                                    onChange={(e) => handleInputChange(index, 'productDescription', e.target.value)}
                                    fullWidth
                                    InputProps={{ readOnly: readOnly }}
                                />
                            </TableCell>
                            <TableCell>
                                <CurrencyPriceInput
                                    price={product.productPrice}
                                    currency={product.currency}
                                    onPriceChange={(value) => handlePriceCurrencyChange(index, value)}
                                    onCurrencyChange={(value) => handleCurrencyPriceChange(index, 'currency', value)}
                                    readonly={readOnly}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={product.videourlForproduct || ''}
                                    onChange={(e) => handleInputChange(index, 'videourlForproduct', e.target.value)}
                                    fullWidth
                                    InputProps={{ readOnly: readOnly }}
                                />
                            </TableCell>
                            {showActions && !readOnly && (
                                <TableCell>
                                    <IconButton
                                        aria-label="remove product"
                                        onClick={() => onRemove(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;
