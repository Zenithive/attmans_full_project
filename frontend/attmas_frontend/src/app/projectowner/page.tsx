"use client";
import * as React from 'react';
import UserList from '../component/Freelancer&InnovatorsCard';
import { APIS } from '../constants/api.constant';

const ProjectOwner: React.FC = () => {
  return (
    <UserList
      apiUrl={APIS.PROJECTOWNERS}
      title="Project Owners"
      endMessage="No more Project Owners"
    />
  );
};

export default ProjectOwner;
