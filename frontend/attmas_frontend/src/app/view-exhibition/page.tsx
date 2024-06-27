'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';

interface Exhibition {
  _id?: string;
  title: string;
  description: string;
  status: string;
  videoUrl: string;
  dateTime: string;
  industries: string[];
  subjects: string[];
  userId?: string;
}

const ExhibitionsPage: React.FC<Exhibition> = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]); 
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get(`${APIS.EXHIBITION}`);
        setExhibitions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExhibitions();
  }, []);

  return (
    <div>
      <h1>Exhibitions</h1>
        {exhibitions.map((exhibition) => (
          <div key={exhibition._id}>{exhibition.videoUrl}</div>
        ))}
    </div>
  );
};

export default ExhibitionsPage;
