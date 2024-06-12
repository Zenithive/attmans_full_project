"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, colors, Typography, Card, CardContent, IconButton } from '@mui/material';
import { AddExhibition } from '../component/exhibition/add-exhibition';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import pubsub from '../services/pubsub.service';

interface Exhibition {
  _id?: string;
  title: string;
  description: string;
  status: string;
  videoUrl: string;
  dateTime: string;
  industries: string[];
  subjects: string[];
}

const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);

  const fetchExhibitions = async () => {
    try {
      const response = await axios.get(APIS.EXHIBITION);
      setExhibitions(response.data);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  };

  const refetch = async () => {
    try {
      await fetchExhibitions();
    } catch (error) {
      console.error('Error refetching exhibitions:', error);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  useEffect(() => {
    pubsub.subscribe('ExhibitionCreated', refetch);

    return () => {
      pubsub.unsubscribe('ExhibitionCreated', refetch);
    };

  }, []);

  // const handleAddExhibition = async (newExhibition: any) => {
  //   try {
  //     await axios.post(APIS.EXHIBITION, newExhibition);
  //     fetchExhibitions();
  //   } catch (error) {
  //     console.error('Error adding exhibition:', error);
  //   }
  // };

  const handleEditExhibition = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
  };

  const handleCancelEdit = () => {
    setEditingExhibition(null);
  };

  const handleDeleteExhibition = async (editingExhibition: Exhibition) => {
    try {
      await axios.delete(`${APIS.EXHIBITION}/${editingExhibition._id}`);
      setExhibitions(exhibitions.filter(exhibition => exhibition._id !== editingExhibition._id));
      pubsub.publish('ExhibitionDeleted', { message: 'Exhibition Deleted' });
    } catch (error) {
      console.error('Error deleting exhibition:', error);
    }
  };

  return (
    <Box sx={{ background: colors.grey[100], p: 2, borderRadius: "30px !important" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h2" sx={{ marginY: 0 }}>Exhibitions</Typography>
        <AddExhibition editingExhibition={editingExhibition} onCancelEdit={handleCancelEdit} 
         />
      </Box>
      <Box sx={{ mt: 2 }}>
        {exhibitions.map((exhibition) => (
          <Card key={exhibition._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5">
                {exhibition.title}
                <span style={{ fontSize: 'small', color: "#616161" }}>
                  ({dayjs(exhibition.dateTime).format('MMMM D, YYYY h:mm A')})
                </span>
                <span style={{ fontSize: 'small', fontWeight: "bolder", float: "right" }}>
                  {exhibition.status}
                </span>
              </Typography>
              <Typography variant="body2">{exhibition.description}</Typography>
              <Typography variant="caption">{exhibition.industries.join(', ')}, {exhibition.subjects.join(', ')}</Typography>
              <Typography sx={{ display: "flex", float: "right" }}>
                <IconButton onClick={() => handleEditExhibition(exhibition)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteExhibition(exhibition)}>
                  <DeleteRoundedIcon />
                </IconButton>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Exhibition;
