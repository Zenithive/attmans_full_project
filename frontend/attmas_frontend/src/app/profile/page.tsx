"use client";
import React, { useState } from 'react';
import Profile1 from '../component/all_Profile_component/profile1';
import Profile2 from '../component/all_Profile_component/profile2';
import Profile3 from '../component/all_Profile_component/profile3';
import HorizontalStepper from '../component/all_Profile_component/upperLine';
import Category from '../component/all_Profile_component/multipleDropDownCategory';

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  return (
    <>
      <HorizontalStepper />
      {currentStep === 1 && <Profile1 onNext={handleNext} />}
      {currentStep === 2 && (
        <Profile2 onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 3 && (
        <>
          <Profile3 onPrevious={handlePrevious} />
          <Category />
        </>
      )}
    </>
  );
};

export default Page;
