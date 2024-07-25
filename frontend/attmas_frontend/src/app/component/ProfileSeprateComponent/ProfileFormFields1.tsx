'use client'
import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

const ProfileFormFields: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<any>();

  const getHelperText = (field: string) => {
    return touched[field] && typeof errors[field] === 'string' ? errors[field] : undefined;
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
          label="Address"
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
          style={{ background: 'white', borderRadius: '25px' }}
          id="city"
          label="City"
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
          label="State"
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
          label="Pin Code"
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
          label="Country"
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
          label="LinkedIn"
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
          label="Gender"
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
          label="Billing Address"
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
