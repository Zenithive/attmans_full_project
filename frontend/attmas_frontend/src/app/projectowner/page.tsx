"use client";

import * as React from 'react';
import UserList from '../component/Freelancer&InnovatorsCard';
import { APIS } from '../constants/api.constant';
import FreeLancerOrNot from '../component/IsAuthenticateForFreelancer/FreeLancerOrNot'; // Adjust the import path accordingly
import { translationsforMyProjectPage } from '../../../public/trancation';
import { selectUserSession, UserSchema } from '../reducers/userReducer';
import { useAppSelector } from '../reducers/hooks.redux';

const ProjectOwner: React.FC = () => {

  const userDetails: UserSchema = useAppSelector(selectUserSession);


  const language = userDetails.language || 'english';
  const t = translationsforMyProjectPage[language as keyof typeof translationsforMyProjectPage] || translationsforMyProjectPage.english;

  return (
    <FreeLancerOrNot>
      <UserList
        apiUrl={APIS.PROJECTOWNERS}
        title={t.projectOwners}
        endMessage={t.NomoreProjectOwners}
      />
    </FreeLancerOrNot>
  );
};

export default ProjectOwner;
