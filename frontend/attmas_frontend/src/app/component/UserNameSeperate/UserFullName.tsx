// components/UserFullName.tsx
import React from 'react';
import { Typography } from '@mui/material';

interface UserFullNameProps {
  firstName: string;
  lastName: string;
}

const UserFullName: React.FC<UserFullNameProps> = ({ firstName, lastName }) => {
  return (
    <Typography
      variant="h6"
      sx={{
        textAlign: 'center', // Align text to the center
        width: '100%' // Optional: Ensure it spans the full width to align correctly
      }}
    >
      {`${firstName} ${lastName}`}
    </Typography>
  );
};

export default UserFullName;
