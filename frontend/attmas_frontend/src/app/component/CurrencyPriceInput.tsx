import React from 'react';
import { TextField, Select, MenuItem, InputAdornment } from '@mui/material';

interface CurrencyPriceInputProps {
  price: number;
  currency: string;
  onPriceChange: (price: string) => void;
  onCurrencyChange: (currency: string) => void;
  readonly?: boolean; // Add this prop to the interface
}

const CurrencyPriceInput: React.FC<CurrencyPriceInputProps> = ({
  price,
  currency,
  onPriceChange,
  onCurrencyChange,
  readonly = false, // Default to false
}) => {
  return (
    <TextField
      value={price}
      onChange={(e) => !readonly && onPriceChange(e.target.value)}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Select
              value={currency}
              onChange={(e) => !readonly && onCurrencyChange(e.target.value as string)}
              displayEmpty
              variant="standard"
              sx={{
                '.MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  outline: 'none',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiSelect-select': {
                  outline: 'none',
                },
              }}
              disabled={readonly} // Disable selection when readonly
            >
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </InputAdornment>
        ),
        readOnly: readonly, // Set readOnly based on the readonly prop
      }}
    />
  );
};

export default CurrencyPriceInput;
