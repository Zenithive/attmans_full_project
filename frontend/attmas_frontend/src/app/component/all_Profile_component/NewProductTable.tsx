import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AddProductModal2 from './AddProductModal2'; // Import your AddProductModal2 component
import { Product } from '../ProductTable'; // Assuming Product interface includes productPrice and currency
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { translationsforNewProductTable } from '../../../../public/trancation';

interface NewProductTableProps {
    products?: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    hideActions?: boolean; // New prop to hide the actions
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

const NewProductTable: React.FC<NewProductTableProps> = ({ products, onEdit, onDelete, hideActions }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userDetails: UserSchema = useAppSelector(selectUserSession);

  const language = userDetails.language || 'english';
  const t = translationsforNewProductTable[language as keyof typeof translationsforNewProductTable] || translationsforNewProductTable.english;

    const handleView = (product: Product) => {
        setSelectedProduct(product); // Set the selected product
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedProduct(null); // Clear the selected product
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t.productName}</TableCell>
                            <TableCell>{t.price}</TableCell>
                            <TableCell>{t.quantity}</TableCell>
                            <TableCell>{t.stageOfDevelopment}</TableCell> {/* New column */}
                            <TableCell>{t.video}</TableCell>
                            <TableCell>{t.actions}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.map((product) => (
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
                                    <IconButton onClick={() => handleView(product)} aria-label="view">
                                        <VisibilityIcon />
                                    </IconButton>
                                    {!hideActions && (
                                        <>
                                            <IconButton onClick={() => onEdit(product)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => onDelete(product.id)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Render AddProductModal2 */}
            {selectedProduct && (
                <AddProductModal2
                    open={isModalOpen}
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={() => {}}
                    viewOnly={true}
                />
            )}
        </>
    );
};

export default NewProductTable;
