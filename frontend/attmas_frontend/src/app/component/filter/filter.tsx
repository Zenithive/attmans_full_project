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
      {options.includes("All") && (
        <ToggleButton value="All" aria-label="all">All</ToggleButton>
      )}
      {options.includes("Pending") && (
        <ToggleButton value="Pending" aria-label="pending">Pending</ToggleButton>
      )}
      {options.includes("Approved") && (
        <ToggleButton value="Approved" aria-label="approved">Approved</ToggleButton>
      )}
      {options.includes("Rejected") && (
        <ToggleButton value="Rejected" aria-label="rejected">Rejected</ToggleButton>
      )}
      {options.includes("Awarded") && (
        <ToggleButton value="Awarded" aria-label="awarded">Awarded</ToggleButton>
      )}
      {options.includes("Not Awarded") && (
        <ToggleButton value="Not Awarded" aria-label="not-awarded">Not Awarded</ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

export default StatusFilter;
