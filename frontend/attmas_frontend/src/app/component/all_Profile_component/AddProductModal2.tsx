import React from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem
} from '@mui/material';

interface SelectedProduct {
    productName: string;
    productDescription: string;
    productQuantity: string;
    videourlForproduct: string;
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
    productPrice: string;
    currency: string;
}

interface AddProductModalProps2 {
    open: boolean;
    onClose: () => void;
    onSave?: (
        productName: string,
        productDescription: string,
        productQuantity: string,
        videourlForproduct: string,
        targetaudience: string,
        problemaddressed: string,
        technologyused: string,
        intellectualpropertyconsiderations: string,
        stageofdevelopmentdropdown: string,
        CompetitiveAdvantages: string,
        feasibilityofthesolution: string,
        howdoesthesolutionwork: string,
        potentialbenefits: string,
        challengesorrisks: string,
        productPrice: string,
        currency: string,
    ) => void;
    selectedProduct?: SelectedProduct | null;
    readOnly?: boolean; // New prop for read-only mode
}

const AddProductModal2: React.FC<AddProductModalProps2> = ({ open, onClose, onSave, readOnly = false ,selectedProduct}) => {
    const [productName, setProductName] = React.useState('');
    const [productDescription, setProductDescription] = React.useState('');
    const [productQuantity, setProductQuantity] = React.useState('');
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
    const [productPrice, setProductPrice] = React.useState('');
    const [currency, setCurrency] = React.useState('');

    React.useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct.productName || '');
            setProductDescription(selectedProduct.productDescription || '');
            setProductQuantity(selectedProduct.productQuantity || '');
            setVideourlForproduct(selectedProduct.videourlForproduct || '');
            setTargetaudience(selectedProduct.targetaudience || '');
            setProblemaddressed(selectedProduct.problemaddressed || '');
            setTechnologyused(selectedProduct.technologyused || '');
            setStageofdevelopmentdropdown(selectedProduct.stageofdevelopmentdropdown || '');
            setIntellectualpropertyconsiderations(selectedProduct.intellectualpropertyconsiderations || '');
            setCompetitiveAdvantages(selectedProduct.CompetitiveAdvantages || '');
            setFeasibilityofthesolution(selectedProduct.feasibilityofthesolution || '');
            setHowdoesthesolutionwork(selectedProduct.howdoesthesolutionwork || '');
            setPotentialbenefits(selectedProduct.potentialbenefits || '');
            setChallengesorrisks(selectedProduct.challengesorrisks || '');
            setProductPrice(selectedProduct.productPrice || '');
            setCurrency(selectedProduct.currency || '');
        }
    }, [selectedProduct]);
    

    const handleSave = () => {
        if (!readOnly && onSave) {
            onSave(productName, productDescription, productQuantity, videourlForproduct, targetaudience, problemaddressed, technologyused, stageofdevelopmentdropdown, intellectualpropertyconsiderations, CompetitiveAdvantages, feasibilityofthesolution, howdoesthesolutionwork, potentialbenefits, challengesorrisks, productPrice, currency);
        }
        onClose(); // Close the modal after saving or cancelling
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900, // Adjust width if needed
                    maxHeight: '95vh', // Set max height relative to viewport height
                    overflowY: 'auto', // Enable scrolling if content exceeds max height
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid #000',
                    boxShadow: 24,
                    p: 4, // Reduce padding if needed
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    {readOnly ? 'View Product Details' : 'Add Product Details'}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            color="secondary"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            rows={4}
                            label="Product Description"
                            multiline
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            rows={4}
                            label="How Does the Solution Work?"
                            multiline
                            value={howdoesthesolutionwork}
                            onChange={(e) => setHowdoesthesolutionwork(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Quantity"
                            color="secondary"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Video URL"
                            value={videourlForproduct}
                            onChange={(e) => setVideourlForproduct(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Price"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Stage of Development"
                            value={stageofdevelopmentdropdown}
                            onChange={(e) => setStageofdevelopmentdropdown(e.target.value)}
                            InputProps={{ readOnly }}
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
                            value={intellectualpropertyconsiderations}
                            onChange={(e) => setIntellectualpropertyconsiderations(e.target.value)}
                            InputProps={{ readOnly }}
                        >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Target Audience"
                            value={targetaudience}
                            onChange={(e) => setTargetaudience(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Technology Used"
                            value={technologyused}
                            onChange={(e) => setTechnologyused(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Problem Addressed"
                            value={problemaddressed}
                            onChange={(e) => setProblemaddressed(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            rows={4}
                            multiline
                            label="Competitive Advantages"
                            value={CompetitiveAdvantages}
                            onChange={(e) => setCompetitiveAdvantages(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Feasibility of the Solution"
                            value={feasibilityofthesolution}
                            onChange={(e) => setFeasibilityofthesolution(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Potential Benefits"
                            value={potentialbenefits}
                            onChange={(e) => setPotentialbenefits(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            rows={4}
                            multiline
                            label="Challenges or Risks"
                            value={challengesorrisks}
                            onChange={(e) => setChallengesorrisks(e.target.value)}
                            InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        {!readOnly && (
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default AddProductModal2;
