


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

interface AddProductModalProps2 {
    open: boolean;
    onClose: () => void;
    onSave: (
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
}

const AddProductModal2: React.FC<AddProductModalProps2> = ({ open, onClose, onSave }) => {
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

    const handleSave = () => {
        onSave(productName, productDescription, productQuantity, videourlForproduct, targetaudience, problemaddressed, technologyused, stageofdevelopmentdropdown, intellectualpropertyconsiderations, CompetitiveAdvantages, feasibilityofthesolution, howdoesthesolutionwork, potentialbenefits, challengesorrisks, productPrice, currency);
        onClose(); // Close the modal after saving
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
                    Add Product Details
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            color="secondary"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
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
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Quantity"
                            color="secondary"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Video URL"
                            value={videourlForproduct}
                            onChange={(e) => setVideourlForproduct(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Product Price"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Stage of Development"
                            value={stageofdevelopmentdropdown}
                            onChange={(e) => setStageofdevelopmentdropdown(e.target.value)}
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
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Technology Used"
                            value={technologyused}
                            onChange={(e) => setTechnologyused(e.target.value)}
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
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default AddProductModal2;
