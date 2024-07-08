'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIS } from '../constants/api.constant';
import { useAppSelector } from '../reducers/hooks.redux';
import { UserSchema, selectUserSession } from '../reducers/userReducer';
import { Box, Typography, Divider, Card, CardContent, Button } from '@mui/material';
import BoothDetailsModal from '../component/booth/booth';
import { useSearchParams } from 'next/navigation'

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
        const response = await axios.get(`${APIS.GET_BOOTH}`); 
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
          width="500"
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
       <div style={{position:"relative",color:'white',textAlign:"center",background:"#cc4800",right:"8px",width:"102%",bottom:"29px"}}><h1 style={{position:'relative',top:"15%"}}>Exhibition</h1>
       {!(userType === "Admin") && (
          <Button variant="contained" color="primary" onClick={openModal} style={{ position:'relative', float:"right", bottom:'60px', right:'5%', background:'#757575', fontWeight:'bolder', color:'white'}}>
              Create Booth
            </Button>
        )}

        <BoothDetailsModal open={showModal} onClose={closeModal} createBooth={handleCreateBooth} />
       </div>
        {exhibitions.map((exhibition) => (
          <div key={exhibition._id}>
            <Box sx={{float:'right',right:'18%',position:'relative'}}>
            <Box sx={{background:'red',width:'56%',color:'white',borderRadius:'10px'}}><h1>Exhibition Details</h1></Box>
            <h2>Title:- {exhibition.title}</h2>
           <h2>Description:- {exhibition.description}</h2>
           <h2>Date-Time:- {exhibition.dateTime}</h2>
           <h2>Industries:- {exhibition.industries}</h2>
           <h2>Subjects:- {exhibition.subjects}</h2>
           </Box>
           <div style={{position:'relative',left:'65px'}}>{renderVideo(exhibition.videoUrl)}</div>
          </div>
          
        ))}
          <div>
             {booths.map(booth => (
               <div key={booth._id}>
                 <Box sx={{position:'relative',left:'10%'}}>
                 <Box sx={{background:'red',width:'13%',color:'white',borderRadius:'10px'}}><h1>Booth Details</h1></Box>
                   <h2>Title:- {booth.title}</h2>
                   <h2>Description:- {booth.description}</h2>
                   <h2>Products:- </h2>
                   <ul>
                     {booth.products.map(product => (
                       <li key={product.name}>
                         <h2>{product.name} - {product.description} - {product.productType} - ${product.price}</h2>
                       </li>
                     ))}
                   </ul>
                   </Box>
               </div>
             ))}
           </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
