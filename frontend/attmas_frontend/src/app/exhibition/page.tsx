"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, colors, Typography, Card, CardContent } from '@mui/material';
import { AddExhibition } from '../component/exhibition/add-exhibition';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';


const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchExhibitions = async () => {
    try {
      const response = await axios.get(APIS.EXHIBITION);
      setExhibitions(response.data);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleAddExhibition = async (newExhibition:any) => {
    try {
      await axios.post(APIS.EXHIBITION, newExhibition);
      fetchExhibitions(); 
    } catch (error) {
      console.error('Error adding exhibition:', error);
    }
  };

  return (
    <Box sx={{ borderRadius: 3, background: colors.grey[100], p: 2,borderRadius:"30px !important"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h2" sx={{ marginY: 0 }}>Exhibitions</Typography>
        <AddExhibition onAddExhibition={handleAddExhibition}/>
      </Box>
      <Box sx={{ mt: 2 }}>
        {exhibitions.map((exhibition) => (
          <Card key={exhibition} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5">{exhibition.title},{exhibition.dateTime}</Typography>
              <Typography variant="body2">{exhibition.description}</Typography>
              <Typography variant="caption">{exhibition.industries.join(', ')},{exhibition.subjects.join(', ')}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Exhibition;
