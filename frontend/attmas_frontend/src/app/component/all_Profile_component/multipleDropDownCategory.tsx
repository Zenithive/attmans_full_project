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
  border: 2px solid black;
  border-radius: 10px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
    // Add other categories with their corresponding additional fields here
    'Agriculture':[
        'Plant Science',
        'Agricultural Engineering and Technology',
        'Organic agriculture',
    ],
    'Electronics':[
        
    
    ],
    'Energy':[

    
    ],
    'Environmental and waste management':[

    
    ],
    'Food and beverage':[

    
    ],
    'Healthcare':[

    
    ],
    'Medical devices and equipment':[

    
    ],
    'Mining and metals':[

    
    ],
    'Real estate and construction':[

    
    ],
    'Textiles':[

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
