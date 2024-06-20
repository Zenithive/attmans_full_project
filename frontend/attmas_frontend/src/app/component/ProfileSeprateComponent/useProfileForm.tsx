import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { APIS, SERVER_URL } from '@/app/constants/api.constant';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';

export const useProfileForm = (initialValues: any, onSubmit: (values: any) => Promise<void>) => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const userDetails: UserSchema = useAppSelector(selectUserSession);

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      username: userDetails.username,
    },
    validationSchema: Yup.object({
      gender: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      pinCode: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      linkedIn: Yup.string().url('Invalid URL').required('Required'),
      billingAddress: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/profile/profileByUsername?username=${userDetails.username}`);
        const userData = response.data;
        formik.setValues({
          ...formik.values,
          ...userData,
        });
        if (userData.profilePhotoURL) {
          setProfilePhotoURL(userData.profilePhotoURL);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setFetchError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userDetails.username]);

  return { formik, profilePhoto, setProfilePhoto, profilePhotoURL, setProfilePhotoURL, loading, fetchError };
};
