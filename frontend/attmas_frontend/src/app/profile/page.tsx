// "use client";
// import React, { useState } from 'react';
// import Profile1 from '../component/all_Profile_component/profile1';
// import Profile2 from '../component/all_Profile_component/profile2';
// import Profile3 from '../component/all_Profile_component/profile3';
// import HorizontalStepper from '../component/all_Profile_component/upperLine';

// const Page: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(1);

//   const handleNext = () => {
//     setCurrentStep(prevStep => prevStep + 1);
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prevStep => prevStep - 1);
//   };

//   return (
//     <>
//       <HorizontalStepper currentStep={currentStep} />
//       {currentStep === 1 && <Profile1 onNext={handleNext} />}
//       {currentStep === 2 && <Profile2 onNext={handleNext} onPrevious={handlePrevious} />}
//       {currentStep === 3 && (
//         <>
//           <Profile3 onPrevious={handlePrevious} />
//         </>
//       )}
//     </>
//   );
// };

// export default Page;


"use client";
import React, { useState, useEffect } from 'react';
import Profile1 from '../component/all_Profile_component/profile1';
import Profile2 from '../component/all_Profile_component/profile2';
import Profile3 from '../component/all_Profile_component/profile3';
import HorizontalStepper from '../component/all_Profile_component/upperLine';
import { APIS } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import MainSideBar from '../component/MainSideBar';
import axiosInstance from '../services/axios.service';

const Page: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`${APIS.CHECK_PROFILE}?username=${userDetails.username}`);
        setCurrentStep(response.data.profileCompleted || 1);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setCurrentStep(1); // Default to ProfileForm1 if there is an error
      }
    };

    checkUserProfile();
  }, [userDetails.username]);

  const handleNext = () => {
    setCurrentStep(prevStep => (prevStep !== null ? prevStep + 1 : null));
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => (prevStep !== null ? prevStep - 1 : null));
  };

  useEffect(() => {

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  if (currentStep === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {/* <MainSideBar/> */}

    {!isMobileView && <HorizontalStepper currentStep={currentStep} />}
      {currentStep === 1 && <Profile1 onNext={handleNext} />}
      {currentStep === 2 && <Profile2 onNext={handleNext} onPrevious={handlePrevious} />}
      {currentStep === 3 && <Profile3 onPrevious={handlePrevious} />}
    </>
  );
};

export default Page;
