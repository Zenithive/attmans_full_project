import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { APIS } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { UserSchema, selectUserSession } from '@/app/reducers/userReducer';
import * as Yup from 'yup';
import axiosInstance from '@/app/services/axios.service';
import { translationsforProjectCommentCard } from '../../../../public/trancation';

interface AddCommentProps {
  jobId: string;
  applyId:string | undefined;
  onCommentSubmitted: () => void;
}

// const validationSchema = Yup.object({
//   // comment: Yup.string().required('Comment needs to be Filled'),
//   comment: Yup.string().required(t.commentneedtofill),
// });

const AddComment: React.FC<AddCommentProps> = ({ jobId,applyId,onCommentSubmitted }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);


  const language = userDetails.language || 'english';
  const t = translationsforProjectCommentCard[language as keyof typeof translationsforProjectCommentCard] || translationsforProjectCommentCard.english;

  const validationSchema = Yup.object({
    // comment: Yup.string().required('Comment needs to be Filled'),
    comment: Yup.string().required(t.commentneedtofill),
  });
  const handleSubmit = async (
    values: { comment: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await axiosInstance.post(`${APIS.ADD_COMMENT}`, {
        createdBy: userDetails._id,
        commentText: values.comment,
        jobId,
        applyId,
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
              label={t.addacomment}
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
              {isSubmitting ? t.Submitting : t.SubmitComment}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddComment;
