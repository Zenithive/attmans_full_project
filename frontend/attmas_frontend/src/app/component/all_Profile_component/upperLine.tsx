import React from 'react';
import { Stepper, Step, StepLabel, Box, Typography } from '@mui/material';
import { AccountCircle, Lock, Flag } from '@mui/icons-material';

const steps = [
  { label: 'Personal Details', icon: <Lock /> },
  { label: 'Work Experience', icon: <AccountCircle /> },
  { label: 'Category', icon: <Flag /> },
];

const CustomStepIcon = (props:any) => {
  const { active, completed, icon } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: active ? '#00aaff' : completed ? '#aaffaa' : '#ccc',
        color: 'white',
      }}
    >
      {icon}
    </div>
  );
};

const HorizontalStepper = () => {
  const [activeStep, setActiveStep] = React.useState(1); // Change to set active step

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper 
        activeStep={activeStep} 
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
          },
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
            borderTopColor: '#00aaff',
            marginTop: 1, // Adjust this value to move the connector line down
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={() => <CustomStepIcon {...step} active={undefined} completed={undefined} />}>
              <Typography variant="caption" color={activeStep === index ? 'primary' : 'textSecondary'}>
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
