import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface StatusFilterProps {
  value: string | null;
  onChange: (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="status filter"
      sx={{
        position: 'relative', 
        left: '45%', 
        bottom: '63px', 
        '@media (max-width: 767px)': {
          position: 'relative',
          top: '10px',
          left: '-24px'
        }
      }}
    >
      <ToggleButton value="All" aria-label="all">All</ToggleButton>
      <ToggleButton value="Pending" aria-label="pending">Pending</ToggleButton>
      <ToggleButton value="Approved" aria-label="approved">Approved</ToggleButton>
      <ToggleButton value="Rejected" aria-label="rejected">Rejected</ToggleButton>
      <ToggleButton value="Awarded" aria-label="awarded">Awarded</ToggleButton>
      <ToggleButton value="Not Awarded" aria-label="not-awarded">Not Awarded</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default StatusFilter;
