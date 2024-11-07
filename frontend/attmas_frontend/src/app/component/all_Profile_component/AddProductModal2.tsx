import React, { useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem
} from '@mui/material';

export interface Product {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: number;
    videourlForproduct?: string;
    targetaudience: string;
    problemaddressed: string;
    technologyused: string;
    intellectualpropertyconsiderations: string;
    stageofdevelopmentdropdown: string;
    CompetitiveAdvantages: string;
    feasibilityofthesolution: string;
    howdoesthesolutionwork: string;
    potentialbenefits: string;
    challengesorrisks: string;
    productPrice: number;
    currency: string;
}

interface AddProductModalProps2 {
    open: boolean;
    onClose: () => void;
    onSave: (productDetails: Product) => void;
    product: Product | null;
    viewOnly: boolean;
}

const AddProductModal2: React.FC<AddProductModalProps2> = ({ open, onClose, onSave, product, viewOnly }) => {
    const [productName, setProductName] = React.useState('');
    const [productDescription, setProductDescription] = React.useState('');
    const [productQuantity, setProductQuantity] = React.useState(0);
    const [videourlForproduct, setVideourlForproduct] = React.useState('');
    const [targetaudience, setTargetaudience] = React.useState('');
    const [problemaddressed, setProblemaddressed] = React.useState('');
    const [technologyused, setTechnologyused] = React.useState('');
    const [stageofdevelopmentdropdown, setStageofdevelopmentdropdown] = React.useState('');
    const [intellectualpropertyconsiderations, setIntellectualpropertyconsiderations] = React.useState('');
    const [CompetitiveAdvantages, setCompetitiveAdvantages] = React.useState('');
    const [feasibilityofthesolution, setFeasibilityofthesolution] = React.useState('');
    const [howdoesthesolutionwork, setHowdoesthesolutionwork] = React.useState('');
    const [potentialbenefits, setPotentialbenefits] = React.useState('');
    const [challengesorrisks, setChallengesorrisks] = React.useState('');
    const [productPrice, setProductPrice] = React.useState(0);
    const [currency, setCurrency] = React.useState('INR');

    useEffect(() => {
        if (product) {
            setProductName(product.productName);
            setProductDescription(product.productDescription);
            setProductQuantity(product.productQuantity);
            setVideourlForproduct(product.videourlForproduct || '');
            setTargetaudience(product.targetaudience);
            setProblemaddressed(product.problemaddressed);
            setTechnologyused(product.technologyused);
            setStageofdevelopmentdropdown(product.stageofdevelopmentdropdown);
            setIntellectualpropertyconsiderations(product.intellectualpropertyconsiderations);
            setCompetitiveAdvantages(product.CompetitiveAdvantages);
            setFeasibilityofthesolution(product.feasibilityofthesolution);
            setHowdoesthesolutionwork(product.howdoesthesolutionwork);
            setPotentialbenefits(product.potentialbenefits);
            setChallengesorrisks(product.challengesorrisks);
            setProductPrice(product.productPrice);
            setCurrency(product.currency);
        }
    }, [product]);

    

    const handleSave = () => {
        const newProduct = {
            id: Date.now().toString(),
            productName,
            productDescription,
            productQuantity,
            videourlForproduct,
            targetaudience,
            problemaddressed,
            technologyused,
            stageofdevelopmentdropdown,
            intellectualpropertyconsiderations,
            CompetitiveAdvantages,
            feasibilityofthesolution,
            howdoesthesolutionwork,
            potentialbenefits,
            challengesorrisks,
            productPrice,
            currency
        };
    
        onSave(newProduct);
        handleClose();

        
    
    };
    

    const handleClose = () => {
        onClose();

        setTimeout(()=>{

            // Reset all form fields
            setProductName('');
            setProductDescription('');
            setProductQuantity(0);
            setVideourlForproduct('');
            setTargetaudience('');
            setProblemaddressed('');
            setTechnologyused('');
            setStageofdevelopmentdropdown('');
            setIntellectualpropertyconsiderations('');
            setCompetitiveAdvantages('');
            setFeasibilityofthesolution('');
            setHowdoesthesolutionwork('');
            setPotentialbenefits('');
            setChallengesorrisks('');
            setProductPrice(0);
            setCurrency('INR');
        }, 200)

        
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900,
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid #000',
                    boxShadow: 24,
                    p: 4,
                    '@media (max-width: 754px)': {
                        width: '80%', 
                        p: 2, 
                        },

                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    {viewOnly ? 'View Product Details' : (product ? 'Edit Product Details' : 'Add Product Details')}
                </Typography>

                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            color="secondary"
                            value={productName}
                            onChange={(e) => !viewOnly && setProductName(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            rows={4}
                            label="Product Description"
                            multiline
                            color="secondary"
                            value={productDescription}
                            onChange={(e) => !viewOnly && setProductDescription(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            rows={4}
                            label="How Does the Solution Work?"
                            multiline
                            color="secondary"
                            value={howdoesthesolutionwork}
                            onChange={(e) => !viewOnly && setHowdoesthesolutionwork(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Quantity"
                            color="secondary"
                            type="number"
                            value={productQuantity}
                            onChange={(e) => !viewOnly && setProductQuantity(parseInt(e.target.value))}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Video URL"
                            color="secondary"
                            value={videourlForproduct}
                            onChange={(e) => !viewOnly && setVideourlForproduct(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Price"
                            color="secondary"
                            type="number"
                            value={productPrice}
                            onChange={(e) => !viewOnly && setProductPrice(parseFloat(e.target.value))}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            color="secondary"
                            value={currency}
                            onChange={(e) => !viewOnly && setCurrency(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        >
                            <MenuItem value="INR">INR</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Stage of Development"
                            color="secondary"
                            value={stageofdevelopmentdropdown}
                            onChange={(e) => !viewOnly && setStageofdevelopmentdropdown(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        >
                            <MenuItem value="prototype">Prototype</MenuItem>
                            <MenuItem value="market-ready">Market-Ready</MenuItem>
                            <MenuItem value="in-house manufacturing">In-House Manufacturing</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Intellectual Property Considerations"
                            color="secondary"
                            value={intellectualpropertyconsiderations}
                            onChange={(e) => !viewOnly && setIntellectualpropertyconsiderations(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Target Audience"
                            color="secondary"
                            value={targetaudience}
                            onChange={(e) => !viewOnly && setTargetaudience(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Technology Used"
                            color="secondary"
                            value={technologyused}
                            onChange={(e) => !viewOnly && setTechnologyused(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Problem Addressed"
                            color="secondary"
                            value={problemaddressed}
                            onChange={(e) => !viewOnly && setProblemaddressed(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Competitive Advantages"
                            color="secondary"
                            value={CompetitiveAdvantages}
                            onChange={(e) => !viewOnly && setCompetitiveAdvantages(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Feasibility of the Solution"
                            color="secondary"
                            value={feasibilityofthesolution}
                            onChange={(e) => !viewOnly && setFeasibilityofthesolution(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Potential Benefits"
                            color="secondary"
                            value={potentialbenefits}
                            onChange={(e) => !viewOnly && setPotentialbenefits(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Challenges or Risks"
                            color="secondary"
                            value={challengesorrisks}
                            onChange={(e) => !viewOnly && setChallengesorrisks(e.target.value)}
                            InputProps={{ readOnly: viewOnly }}
                        />
                    </Grid>

                </Grid>

                <Box mt={2} display="flex" justifyContent="flex-end">
                    {!viewOnly && (
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Save
                        </Button>
                    )}
                    <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddProductModal2;
