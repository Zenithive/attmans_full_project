import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';

const TermsAndConditions: React.FC = () => {
    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: 'auto',
                padding: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: 'background.paper',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Terms and Conditions
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Introduction
            </Typography>
            <Typography variant="body1" paragraph>
                Welcome to Our Website! These Terms and Conditions outline the rules and regulations for the use of Our Website.
                By accessing this website we assume you accept these terms and conditions. Do not continue to use the website
                if you do not agree to take all of the terms and conditions stated on this page.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
                Other than the content you own, under these Terms, We and/or our licensors own all the intellectual property rights
                and materials contained in this Website. You are granted limited license only for purposes of viewing the material
                contained on this Website.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Restrictions
            </Typography>
            <Typography variant="body1" paragraph>
                You are specifically restricted from all of the following: publishing any Website material in any other media;
                selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing
                any Website material; using this Website in any way that is or may be damaging to this Website; using this Website
                in any way that impacts user access to this Website; using this Website contrary to applicable laws and regulations,
                or in any way may cause harm to the Website, or to any person or business entity.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Your Content
            </Typography>
            <Typography variant="body1" paragraph>
                In these Website Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material
                you choose to display on this Website. By displaying Your Content, you grant Us a non-exclusive, worldwide,
                irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all
                media.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
                In no event shall We, nor any of our officers, directors, employees, and agents, be liable to you for anything arising
                out of or in any way connected with your use of this Website, whether such liability is under contract, tort or
                otherwise, and We shall not be liable for any indirect, consequential or special liability arising out of or in
                any way related to your use of this Website.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
                We may update our Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms
                and Conditions on this page. You are advised to review this Terms and Conditions periodically for any changes.
                Changes to these Terms and Conditions are effective when they are posted on this page.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => window.history.back()}>
                    Go Back
                </Button>
            </Box>
        </Box>
    );
};

export default TermsAndConditions;
