import React from 'react';
import { Stepper, Step, StepLabel, Box, Typography } from '@mui/material';
import { AccountCircle, Lock, Flag } from '@mui/icons-material';

const steps = [
  { label: 'Personal Details', icon: <Lock /> },
  { label: 'Work Experience', icon: <AccountCircle /> },
  { label: 'Category', icon: <Flag /> },
];

interface CustomStepIconProps {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
}

const CustomStepIcon: React.FC<CustomStepIconProps> = ({ active, completed, icon }) => {
  const iconColor = completed ? '#aaffaa' : '#ccc'; // Green for completed, grey for others

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: iconColor,
        color: 'white',
      }}
    >
      {icon}
    </div>
  );
};

interface HorizontalStepperProps {
  currentStep: number;
}

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({ currentStep }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={currentStep - 1}
        alternativeLabel
        sx={{
          '& .MuiStep-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiStepLabel-root': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#000 !important',
          },
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
            borderTopColor: '#D3D3D3',
            marginTop: 1, // Adjust this value to move the connector line down
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={() => (
              <CustomStepIcon
                active={currentStep - 1 === index}
                completed={currentStep - 1 > index}
                icon={step.icon}
              />
            )}>
              <Typography variant="caption" color={currentStep - 1 === index ? 'secondary' : 'textSecondary'}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default HorizontalStepper;
