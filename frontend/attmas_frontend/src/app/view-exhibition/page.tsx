'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent } from '@mui/material';

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

interface SubmittedInnovator {
  username: string;
  innovators: string;
}

const ExhibitionsPage: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [submittedInnovators, setSubmittedInnovators] = useState<SubmittedInnovator[]>([]);
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get(APIS.EXHIBITION);
        setExhibitions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubmittedInnovators = async () => {
      try {
        const response = await axios.get(`${APIS.GET_SUBMITTED_INNOVATORS}?userId=${userDetails._id}`);
        setSubmittedInnovators(response.data);
      } catch (error) {
        console.error('Error fetching submitted innovators:', error);
      }
    };

    fetchExhibitions();
    fetchSubmittedInnovators();
  }, [userDetails._id]);

  const renderVideo = (url: string) => {
    if (!url) {
      return null;
    }
    
    const platforms = [
      {
        name: 'YouTube',
        check: (url: string) => url.includes('youtube.com') || url.includes('youtu.be'),
        embedUrl: (url: string) => {
          const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
          return `https://www.youtube.com/embed/${videoId}`;
        }
      },
      {
        name: 'Vimeo',
        check: (url: string) => url.includes('vimeo.com'),
        embedUrl: (url: string) => {
          const videoId = url.split('vimeo.com/')[1];
          return `https://player.vimeo.com/video/${videoId}`;
        }
      },
      {
        name: 'Pexels',
        check: (url: string) => url.includes('pexels.com'),
        embedUrl: (url: string) => {
          const videoId = url.split('pexels.com/')[1];
          return `https://www.pexels.com/video/${videoId}`;
        }
      },
      {
        name: 'Default',
        check: (url: string) => true,
        embedUrl: (url: string) => url
      }
    ];

    const platform = platforms.find(p => p.check(url));
    const embedUrl = platform?.embedUrl(url);

    if (platform?.name === 'Default') {
      return (
        <video width="1100" controls>
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <iframe
          width="1100"
          height="615"
          style={{ borderRadius: "30px" }}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  };
  

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
       <div style={{position:"relative",color:'white',textAlign:"center",background:"#cc4800",height:"4%",right:"8px",width:"113.3%",bottom:"29px"}}><h1 style={{position:'relative',top:"15%"}}>Exhibition</h1></div>
        {exhibitions.map((exhibition) => (
          <div key={exhibition._id}>
            <h2 style={{position:'relative',float:"right"}}>{exhibition.title}</h2>
           <div style={{position:'relative',left:'65px'}}>{renderVideo(exhibition.videoUrl)}</div>
          </div>
        ))}
      </div>

      <div style={{ width: '4px', backgroundColor: 'gray',position:'relative',left:"7%",bottom:"8px"}}></div>

      <div style={{ flex: 1}}>
        <Box sx={{ mt: 4, p: 2 ,width:'70%',float:"right"}}>
          <Typography variant="h5" sx={{ mb: 2, color: "Black", borderRadius: "15px", textAlign: "center", height: "45px", fontWeight: "bolder" }}>
            <div style={{ position: "relative", top: "7px" }}>Submitted Innovators :-</div>
          </Typography>
          <Divider sx={{ my: '$5' }} />
          {submittedInnovators.map((innovator, index) => (
            <Card sx={{ mb: 2 }} key={index}>
              <CardContent>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Innovators: {innovator.innovators}, User: {innovator.username}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
