"use client";
import * as React from 'react';
import UserList from '../Freelancer&InnovatorsCard';
import { APIS } from '../../constants/api.constant';

const Innovators: React.FC = () => {
  return (
    <UserList
      apiUrl={APIS.INNOVATORS}
      title="Innovators"
      endMessage="No more innovators"
    />
  );
};

export default Innovators;
