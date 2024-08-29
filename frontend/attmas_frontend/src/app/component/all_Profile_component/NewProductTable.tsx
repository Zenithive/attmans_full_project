import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Product } from '../ProductTable'; // Assuming Product interface includes productPrice and currency

interface NewProductTableProps {
    products: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

// Helper function to get the currency symbol
const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
        case 'INR':
            return '₹';
        case 'USD':
            return '$';
        default:
            return ''; // Default to an empty string if no match is found
    }
};

const NewProductTable: React.FC<NewProductTableProps> = ({ products, onView, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Stage of Development</TableCell> {/* New column */}
                        <TableCell>Video</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{`${getCurrencySymbol(product.currency)} ${product.productPrice}`}</TableCell>
                            <TableCell>{product.productQuantity}</TableCell>
                            <TableCell>{product.stageofdevelopmentdropdown}</TableCell> {/* Displaying stage of development */}
                            <TableCell>
                                {product.videourlForproduct && (
                                    <IconButton
                                        aria-label="watch video"
                                        onClick={() => window.open(product.videourlForproduct, '_blank')}
                                    >
                                        <YouTubeIcon />
                                    </IconButton>
                                )}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onView(product)} aria-label="view">
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton onClick={() => onEdit(product)} aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(product.id)} aria-label="delete">
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

export default NewProductTable;
