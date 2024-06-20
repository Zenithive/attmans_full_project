"use client";
import * as React from 'react';
import UserList from '../Freelancer&InnovatorsCard';
import { APIS } from '../../constants/api.constant';

const Freelancers: React.FC = () => {
  return (
    <UserList
      apiUrl={APIS.FREELANCERS}
      title="Freelancers"
      endMessage="No more freelancers"
    />
  );
};

export default Freelancers;
