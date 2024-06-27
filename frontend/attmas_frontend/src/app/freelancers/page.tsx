import React from 'react';
import DataGridDemo from '../component/freelancers/add.freelancersFromUsers';
import FreeLancerOrNot from '../component/IsAuthenticateForFreelancer/FreeLancerOrNot'; // Adjust the import path accordingly

const Freelancers = () => {
  return (
    // <>
    <FreeLancerOrNot> 
      <DataGridDemo />
    </FreeLancerOrNot> 
    // </> 
  );
}

export default Freelancers;
