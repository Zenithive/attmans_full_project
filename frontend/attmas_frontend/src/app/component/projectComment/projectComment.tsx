import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import { APIS } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import * as Yup from 'yup';

interface AddCommentProps {
  jobId: string;
  onCommentSubmitted: () => void;
}

const validationSchema = Yup.object({
  comment: Yup.string().required('Comment is required'),
});

const AddComment: React.FC<AddCommentProps> = ({ jobId, onCommentSubmitted }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const handleSubmit = async (
    values: { comment: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await axios.post(`${APIS.ADD_COMMENT}/comments/${jobId}`, {
        createdBy: userDetails._id,
        commentText: values.comment,
      });
      resetForm();
      onCommentSubmitted();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ comment: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box sx={{ mt: 2 }}>
            <Field
              name="comment"
              as={TextField}
              label="Add a Comment"
              color='secondary'
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              error={!!(errors.comment && touched.comment)}
              helperText={<ErrorMessage name="comment" />}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              endIcon={
                isSubmitting ? <CircularProgress size={24} color="inherit" /> : undefined
              }
              sx={{ position: 'relative' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddComment;
