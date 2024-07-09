'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent, Button, Chip } from '@mui/material';
import BoothDetailsModal from '../component/booth/booth';
import { useSearchParams } from 'next/navigation'
import { relative } from 'path';
import dayjs from 'dayjs';

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
interface Booth {
  _id: string;
  title: string;
  description: string;
  products: { name: string; description: string; productType: string; price: number; }[];
  userId: {
    firstName: string;
    lastName: string;
  };
}


const ExhibitionsPage: React.FC= () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const searchParams = useSearchParams();
  const { userType} = userDetails;


  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const exhibitionId = searchParams.get('exhibitionId');
        if(!exhibitionId){
          console.error('id not found')
          return;
        }
        const response = await axios.get(`${APIS.EXHIBITION}/${exhibitionId}`);
        console.log("respons",response);
        setExhibitions([response.data]);
      } catch (error) {
        console.log(error);
      }
    };
  
      const fetchBooths = async () => {
      try {
        const response = await axios.get(`${APIS.GET_BOOTH}`,{
          params:{
            userId:userDetails._id
          }
        }); 
        setBooths(response.data);
      } catch (error) {
        console.error('Error fetching booths:', error);
      }
    };

    fetchExhibitions();
    fetchBooths();
  }, [userDetails._id,searchParams]);
  

  const handleCreateBooth = async (boothData: any) => {
    try {
      const response = await axios.post(APIS.CREATE_BOOTH, boothData);
      console.log('Booth created:', response.data);
      closeModal();
    } catch (error) {
      console.error('Error creating booth:', error);
    }
  };


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
          width="750"
          height="500"
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
      <div style={{ flex: 1, marginRight: '20px'}}>
       <div style={{position:"relative",color:'black',textAlign:"center",background:"#f5f5f5",right:"8px",width:"102%",bottom:"29px"}}><h1 style={{position:'relative',top:"15%"}}>Exhibition</h1>
       {(userType === "Innovators") && (
          <Button variant="contained" color="primary" onClick={openModal} style={{ position:'relative', float:"right", bottom:'60px', right:'5%', background:'#757575', fontWeight:'bolder', color:'white',height:'32px'}}>
              Participate
            </Button>
        )}

        <BoothDetailsModal open={showModal} onClose={closeModal} createBooth={handleCreateBooth} />
       </div>
       <div>
      {exhibitions.map((exhibition) => (
        <Box key={exhibition._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Card sx={{ flex: 1, marginRight: '10px' }}>
            <CardContent>
              {renderVideo(exhibition.videoUrl)}
            </CardContent>
          </Card>
          <Divider orientation="vertical" flexItem />
          <Card sx={{ flex: 1, marginLeft: '10px',marginBottom:'20%'}}>
            <CardContent>
              <Typography variant="h6">{exhibition.title}, ({dayjs(exhibition.dateTime).format('MMMM D, YYYY h:mm A')})</Typography>
              <Typography variant="h6">{exhibition.description}</Typography>
              <Typography variant="h6"> {exhibition.industries}</Typography>
              <Typography variant="h6">{exhibition.subjects}</Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
    <Divider orientation="horizontal" flexItem/>
      <div>
      <Box sx={{width: '13%', color: 'black', position: 'relative', left: '10%' }}>
        <h1>Booth Details</h1>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '10px', position: 'relative', left: '10%',width:'70%' }}>
        {booths.map(booth => (
          <Card key={booth._id} sx={{ flex: '1 1 calc(33.333% - 10px)', boxSizing: 'border-box', marginBottom: '10px'}}>
            <CardContent>
              <Typography>{booth.title}</Typography>
              <Typography>{booth.userId.firstName} {booth.userId.lastName}</Typography>
              <Box sx={{position:'relative',left:'70%',width:'48%',bottom:'24px'}}> <Chip
                                            label='inProgress'
                                            variant="outlined"
                                            color='secondary'
                                        /></Box>
              <Typography>Products:- </Typography>
              <Typography>
                <ul>
                  {booth.products.map(product => (
                    <div key={product.name} style={{ margin: '20px' }}>
                      <li>
                         {product.name} <br />
                         {product.description} <br />
                         {product.productType} <br />
                         ${product.price}
                      </li>
                    </div>
                  ))}
                </ul>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
