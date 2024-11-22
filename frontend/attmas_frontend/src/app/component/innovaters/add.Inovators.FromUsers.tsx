"use client";
import * as React from 'react';
import UserList from '../Freelancer&InnovatorsCard';
import { APIS } from '../../constants/api.constant';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { translationsforMyProjectPage } from '../../../../public/trancation';
import { useAppSelector } from '@/app/reducers/hooks.redux';

const Innovators: React.FC = () => {

  const userDetails: UserSchema = useAppSelector(selectUserSession);


  const language = userDetails.language || 'english';
  const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;

  return (
    <UserList
      apiUrl={APIS.INNOVATORS}
      title={t.Innovators}
      endMessage={t.Nomoreinnovators}
    />
  );
};

export default Innovators;
