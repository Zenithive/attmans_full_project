"use client";

import * as React from 'react';
import UserList from '../component/Freelancer&InnovatorsCard';
import { APIS } from '../constants/api.constant';
import FreeLancerOrNot from '../component/IsAuthenticateForFreelancer/FreeLancerOrNot'; // Adjust the import path accordingly

const ProjectOwner: React.FC = () => {
  return (
    <FreeLancerOrNot>
      <UserList
        apiUrl={APIS.PROJECTOWNERS}
        title="Project Owners"
        endMessage="No more Project Owners"
      />
    </FreeLancerOrNot>
  );
};

export default ProjectOwner;
