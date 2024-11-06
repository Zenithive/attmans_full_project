import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface StatusFilterProps {
  value: string | null;
  onChange: (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => void;
  options: string[]; // Add options prop to specify which buttons to display
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange, options }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size='small'
      onChange={onChange}
      aria-label="status filter"
      sx={{
        position: 'relative',
        left: '45%',
        bottom: '63px',
        '@media (max-width: 767px)': {
          position: 'relative',
          left: '88px'
        }
      }}
    >
      {options.map((opt) => 
        <ToggleButton value={opt} aria-label={opt}>{opt}</ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

export default StatusFilter;
