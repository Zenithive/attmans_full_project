'use client'
import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';
import { translations } from '../../../../public/trancation';
import { useAppDispatch, useAppSelector } from '@/app/reducers/hooks.redux';
import { addUser, selectUserSession, UserSchema } from '@/app/reducers/userReducer';

const ProfileFormFields: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<any>();

  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const dispatch = useAppDispatch();

  const language = userDetails.language || 'english';
  const t = translations[language as keyof typeof translations] || translations.english;

  const getHelperText = (field: string) => {
    const translation = t as { [key: string]: string }; // Type assertion
    return touched[field] && typeof errors[field] === 'string' 
      ? errors[field] || translation[field] 
      : undefined;
  };

  return (
    <Grid container spacing={2} sx={{'@media (max-width: 767px)': {
                       width:'122%',position:'relative',right:'22px'
                    }}}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={6}
          id="address"
          label={t.address} // Use translated label
          color="secondary"
          name="address"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.address}
          error={touched.address && Boolean(errors.address)}
          // helperText={getHelperText('address')}
          InputProps={{
            style: {
              borderRadius: '25px',
            },
          }}
          inputProps={{
            style: {
              padding: '10px',
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          style={{ background: 'white', borderRadius: '25px' }}
          id="language"
          label= {t.language}// Use translated label
          color="secondary"
          name="language"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.language}
          error={touched.language && Boolean(errors.language)}
        >
          <MenuItem value="english">English</MenuItem>
          <MenuItem value="gujarati">Gujarati</MenuItem>
          {/* Add more languages as needed */}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          style={{ background: 'white', borderRadius: '25px' }}
          id="city"
          label={t.city} // Use translated label
          color="secondary"
          name="city"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.city}
          error={touched.city && Boolean(errors.city)}
          // helperText={getHelperText('city')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          style={{ background: 'white', borderRadius: '25px' }}
          id="state"
          label={t.state} // Use translated label
          color="secondary"
          name="state"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.state}
          error={touched.state && Boolean(errors.state)}
          // helperText={getHelperText('state')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          style={{ background: 'white', borderRadius: '25px' }}
          id="pinCode"
          label={t.pinCode} // Use translated label
          color="secondary"
          name="pinCode"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.pinCode}
          error={touched.pinCode && Boolean(errors.pinCode)}
          // helperText={getHelperText('pinCode')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          style={{ background: 'white', borderRadius: '25px' }}
          id="country"
          label={t.country} // Use translated label
          color="secondary"
          name="country"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.country}
          error={touched.country && Boolean(errors.country)}
          // helperText={getHelperText('country')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          style={{ background: 'white', borderRadius: '25px' }}
          id="linkedIn"
          label={t.linkedIn} // Use translated label
          color="secondary"
          name="linkedIn"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.linkedIn}
          error={touched.linkedIn && Boolean(errors.linkedIn)}
          // helperText={getHelperText('linkedIn')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          select
          style={{ background: 'white', borderRadius: '25px' }}
          id="gender"
          label={t.gender} // Use translated label
          color="secondary"
          name="gender"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.gender}
          error={touched.gender && Boolean(errors.gender)}
          // helperText={getHelperText('gender')}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={6}
          style={{ background: 'white', borderRadius: '25px' }}
          id="billingAddress"
          label={t.billingAddress} // Use translated label
          color="secondary"
          name="billingAddress"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.billingAddress}
          error={touched.billingAddress && Boolean(errors.billingAddress)}
          // helperText={getHelperText('billingAddress')}
          InputProps={{
            style: {
              borderRadius: '25px',
            },
          }}
          inputProps={{
            style: {
              padding: '10px',
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ProfileFormFields;
