import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';

interface JobDetailProps {
  jobId: string;
  onCommentSubmitted?: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId ,  onCommentSubmitted}) => {
  const [job, setJob] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${APIS.JOBS}/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);


  useEffect(() => {
    if (onCommentSubmitted) {
      onCommentSubmitted(); 
    }
  }, [onCommentSubmitted]);

  
  const toggleComments = () => {
    setExpanded((prev) => !prev);
  };

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: '100%', padding: 2, border: '1px solid #ddd', borderRadius: '20px',marginTop:'20px' , backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Comments</Typography>
        <IconButton onClick={toggleComments}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {expanded && (
        <Box
          sx={{
            maxHeight: 300, 
            overflowY: 'auto', 
            marginTop: 2,
            paddingRight: 1, 
          }}
        >
          {job.comments.length > 0 ? (
            job.comments.map((comment: any, index: number) => (
              <Paper key={index} sx={{ padding: 2, marginBottom: 1 }}>
                <Typography variant="body2">
                  <strong>{comment.firstName} {comment.lastName}:</strong> {comment.commentText}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{float:'right', position:'relative',bottom:'20px'}}>
                  <strong>{comment.userType}</strong>
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No comments yet.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default JobDetail;
