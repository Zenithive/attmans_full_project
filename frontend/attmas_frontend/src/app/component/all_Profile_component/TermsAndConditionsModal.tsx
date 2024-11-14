// components/TermsAndConditionsModal.tsx

import React from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { innovatorTerms, freelancerTerms, projectOwnerTerms } from './const';

interface TermsAndConditionsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ open, onClose, onConfirm }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  // Determine which terms to show based on the user type
  const termsToShow = userDetails.userType === 'Innovator'
    ? innovatorTerms
    : userDetails.userType === 'Freelancer'
    ? freelancerTerms
    : userDetails.userType === 'Project Owner'
    ? projectOwnerTerms
    : 'Please read and accept the terms and conditions before proceeding.';

  // Split terms text into sections based on numbering and bullet points
  const splitTerms = termsToShow.split(/\d+\./).map(section => section.trim()).filter(section => section !== '');
  
  // Extract bullet-pointed items
  const formattedTerms = splitTerms.flatMap((section, index) => {
    const items = section.split(/●/).map(item => item.trim()).filter(item => item !== '');
    return index === 0 ? items : items.map(item => `• ${item}`);
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="terms-conditions-title"
      aria-describedby="terms-conditions-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '60%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh', // to handle large text by scrolling
          overflowY: 'auto',
         
        }}
      >
        <Typography id="terms-conditions-title" variant="h6" component="h2">
          Terms and Conditions
        </Typography>
        <pre style={{
            whiteSpace: 'pre-wrap',
        }}  dangerouslySetInnerHTML={{ __html: termsToShow }}       ></pre>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Accept
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TermsAndConditionsModal;
