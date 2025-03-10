import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { APIS } from '@/app/constants/api.constant';
import axiosInstance from '@/app/services/axios.service';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { translationsforProjectCommentCard } from '../../../../public/trancation';

interface JobDetailProps {
  jobId: string;
  applyId: string | undefined;
  onCommentSubmitted?: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId, applyId, onCommentSubmitted }) => {
  const [job, setJob] = useState<any>(null);

  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const language = userDetails.language || 'english';
  const t = translationsforProjectCommentCard[language as keyof typeof translationsforProjectCommentCard] || translationsforProjectCommentCard.english;

  const [expanded, setExpanded] = useState(true);

  const fetchJobDetails = async () => {
    try {
      const response = await axiosInstance.get(`${APIS.JOBS}/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`${APIS.GET_COMMENT}/job/${jobId}/apply/${applyId}`);
      setJob((prevJob: any) => ({ ...prevJob, comments: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    fetchComments();
  }, [jobId, applyId]);

  useEffect(() => {
    if (onCommentSubmitted) {
      fetchComments();
    }
  }, [onCommentSubmitted]);

  const toggleComments = () => {
    setExpanded((prev) => !prev);
  };

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        width: '100%',
        padding: { xs: 1, sm: 2 },
        border: '1px solid #ddd',
        borderRadius: '20px',
        marginTop: { xs: 1, sm: 2 },
        backgroundColor: '#f5f5f5',
        '@media (max-width: 767px)': {
          width: '112%',
          position: 'relative',
          right: '6%',

        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {t.comments}
        </Typography>
        <IconButton onClick={toggleComments}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {expanded && (
        <Box
          sx={{
            maxHeight: { xs: 200, sm: 300 },
            overflowY: 'auto',
            marginTop: 2,
            paddingRight: 1,
            '@media (max-width: 767px)': {
              maxHeight: { xs: 250 }
            }
          }}
        >
          {job.comments.length > 0 ? (
            job.comments.map((comment: any, index: number) => (
              <Paper
                key={index}
                sx={{
                  padding: { xs: 1, sm: 2 },
                  marginBottom: 1,
                  position: 'relative',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', fontSize: { xs: '0.875rem', sm: '1rem' } ,width:'76%','@media (max-width: 767px)': {
                    width:'100%'
                  }}}
                >
                  <strong>{comment.firstName} {comment.lastName}:</strong> {comment.commentText}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>

                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 4, sm: 8 },
                    right: { xs: 4, sm: 8 },
                    textAlign: 'right',
                    '@media (max-width: 767px)': {
                      textAlign: 'right', width: 'fit-content', float: 'right', position: 'relative', top:'-14px'
                    }
                  }}
                >
                  <Typography variant="body2">
                    <strong>{comment.userType}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey' }}>
                    {comment.status}
                  </Typography>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography>{t.nocommentsyet}</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default JobDetail;
