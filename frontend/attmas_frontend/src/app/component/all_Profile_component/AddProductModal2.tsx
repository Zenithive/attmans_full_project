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

interface Product {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: number;
    videourlForproduct: string;
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
}

const AddProductModal2: React.FC<AddProductModalProps2> = ({ open, onClose, onSave}) => {
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

    const reset = () => {
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
    };

    // React.useEffect(() => {
    //     if (selectedProduct) {
    //         setProductName(selectedProduct.productName || '');
    //         setProductDescription(selectedProduct.productDescription || '');
    //         setProductQuantity(selectedProduct.productQuantity || '');
    //         setVideourlForproduct(selectedProduct.videourlForproduct || '');
    //         setTargetaudience(selectedProduct.targetaudience || '');
    //         setProblemaddressed(selectedProduct.problemaddressed || '');
    //         setTechnologyused(selectedProduct.technologyused || '');
    //         setStageofdevelopmentdropdown(selectedProduct.stageofdevelopmentdropdown || '');
    //         setIntellectualpropertyconsiderations(selectedProduct.intellectualpropertyconsiderations || '');
    //         setCompetitiveAdvantages(selectedProduct.CompetitiveAdvantages || '');
    //         setFeasibilityofthesolution(selectedProduct.feasibilityofthesolution || '');
    //         setHowdoesthesolutionwork(selectedProduct.howdoesthesolutionwork || '');
    //         setPotentialbenefits(selectedProduct.potentialbenefits || '');
    //         setChallengesorrisks(selectedProduct.challengesorrisks || '');
    //         setProductPrice(selectedProduct.productPrice || '');
    //         setCurrency(selectedProduct.currency || '');
    //     }
    // }, [selectedProduct]);
    

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
        reset(); 
        onClose();
    };

    const handleClose = () => {
        reset(); // Reset the form fields when the modal closes
        onClose();
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
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    {/* {readOnly ? 'View Product Details' : 'Add Product Details'} */}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            color="secondary"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setProductDescription(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setHowdoesthesolutionwork(e.target.value)}
                            // InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Quantity"
                            color="secondary"
                            type="number"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(parseInt(e.target.value))}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Video URL"
                            color="secondary"
                            value={videourlForproduct}
                            onChange={(e) => setVideourlForproduct(e.target.value)}
                            // InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Price"
                            color="secondary"
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            color="secondary"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
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
                            onChange={(e) => setStageofdevelopmentdropdown(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setIntellectualpropertyconsiderations(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setTargetaudience(e.target.value)}
                            // InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Technology Used"
                            color="secondary"
                            value={technologyused}
                            onChange={(e) => setTechnologyused(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setProblemaddressed(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setCompetitiveAdvantages(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setFeasibilityofthesolution(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setPotentialbenefits(e.target.value)}
                            // InputProps={{ readOnly }}
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
                            onChange={(e) => setChallengesorrisks(e.target.value)}
                            // InputProps={{ readOnly }}
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        {/* {!readOnly && ( */}
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        {/* // )} */}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default AddProductModal2
