import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Container as MuiContainer,
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider as MuiDivider,
    createTheme,
    ThemeProvider,
} from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: "rgb(0,23,98)",
        },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: "rgb(0,23,98)",
                    '&.Mui-checked': {
                        color: "rgb(0,23,98)",
                    },
                },
            },
        },
    },
});

const StyledContainer = styled(MuiContainer)`
  border: 1px solid #ccc;
  border-radius: 40px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); // Added box shadow
`;

const CategoriesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 10px;
`;

const AdditionalFields = styled.div`
  background-color: #ccc;
  padding: 10px;
  margin-top: 20px;
  border-radius: 20px; // Added border radius to match the theme
  box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12); // Added box shadow
`;

const CategoryComponent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value === selectedCategory ? null : event.target.value);
  };

  const categories = [
    'Agriculture', 'Chemicals', 'Electronics', 'Energy',
    'Environmental and waste management', 'Food and beverage', 'Healthcare', 'Medical devices and equipment',
    'Mining and metals', 'Real estate and construction', 'Textiles'
  ];

  const additionalFields = {
    'Chemicals': [
      'Chemical Reagent Development',
      'Dewatering & Drying Technology',
      'Catalysis',
      'Trace Elements',
      'Mathematical Chemistry',
      'Dispersion Chemistry',
      'Surface Science'
    ],
    'Agriculture':[
        'Plant Science',
        'Agricultural Engineering and Technology',
        'Organic agriculture',
    ],
    'Electronics':[
        // Add fields here
    ],
    'Energy':[
        // Add fields here
    ],
    'Environmental and waste management':[
        // Add fields here
    ],
    'Food and beverage':[
        // Add fields here
    ],
    'Healthcare':[
      'Public Health', 'Public Safety', 'Occupational Health & Safety', 'Psychiatry'
    ],
    'Medical devices and equipment':[
      'Device Types',
      'Technology & Engineering',
      'Clinical Applications and Integration',
      'Diagnostics & Monitoring',
      'Therapeutic & Interventional',
      'Assistive & Rehabilitation'
    ],
    'Mining and metals':[
        // Add fields here
    ],
    'Real estate and construction':[
        // Add fields here
    ],
    'Textiles':[
        // Add fields here
    ]
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
          <CategoriesWrapper>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                value={category}
                control={<Radio />}
                label={category}
                sx={{ alignItems: 'center' }}
              />
            ))}
          </CategoriesWrapper>
        </RadioGroup>
        <MuiDivider sx={{ my: 2, borderColor: 'black' }} />
        {selectedCategory && additionalFields[selectedCategory] && (
          <AdditionalFields>
            {additionalFields[selectedCategory].map((field, index) => (
              <div key={index}>{field}</div>
            ))}
          </AdditionalFields>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
};

export default CategoryComponent;
