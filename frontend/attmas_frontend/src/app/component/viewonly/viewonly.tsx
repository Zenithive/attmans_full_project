'use client';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Divider, Drawer } from '@mui/material';
import dayjs from 'dayjs';
import Exhibition from '@/app/exhibition/page';

interface ExhibitionDetailsProps {
  exhibition: Exhibition;
  onClose: () => void;
}

const ExhibitionDetails: React.FC<ExhibitionDetailsProps> = ({ exhibition, onClose }) => {
  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': { width: '50%', borderRadius: 3, pr: 10, mr: -8 } }}
      anchor="right"
      open={Boolean(exhibition)}
      onClose={onClose}
    >
      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', pl: 4 }}>
        <h2>Exhibition Details</h2>
        <IconButton aria-label="close" onClick={onClose} sx={{ p: 0, right: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 5 }} />
      <Box sx={{ p: 2 }}>
        <h3>Title: {exhibition.title}</h3>
        <p><strong>Description:</strong> {exhibition.description}</p>
        <p><strong>Status:</strong> {exhibition.status}</p>
        <p><strong>Video URL:</strong> <a href={exhibition.videoUrl} target="_blank" rel="noopener noreferrer">{exhibition.videoUrl}</a></p>
        <p><strong>Date & Time:</strong> {dayjs(exhibition.dateTime).format('MMMM D, YYYY h:mm A')}</p>
        <p><strong>Industries:</strong> {exhibition.industries.join(', ')}</p>
        <p><strong>Subjects:</strong> {exhibition.subjects.join(', ')}</p>
      </Box>
    </Drawer>
  );
};

export default ExhibitionDetails;
