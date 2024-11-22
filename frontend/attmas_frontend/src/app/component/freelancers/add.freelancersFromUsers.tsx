"use client";
import * as React from 'react';
import UserList from '../Freelancer&InnovatorsCard';
import { APIS } from '../../constants/api.constant';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { translationsforMyProjectPage } from '../../../../public/trancation';

const Freelancers: React.FC = () => {

  const userDetails: UserSchema = useAppSelector(selectUserSession);


  const language = userDetails.language || 'english';
  const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;

  return (
    <UserList
      apiUrl={APIS.FREELANCERS}
      title={t.Freelancers}
      endMessage={t.Nomorefreelancers}
    />
  );
};

export default Freelancers;
