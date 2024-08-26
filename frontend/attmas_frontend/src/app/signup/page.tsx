"use client"
import React from 'react';
import { SignUp } from '../component/SignUp/signup';

const Page: React.FC = () => {
  return (
    <>
      <SignUp interestType={'InterestedUserForExhibition'} />
    </>
  );
};

export default Page;
