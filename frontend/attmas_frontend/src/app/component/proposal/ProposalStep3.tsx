import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { Formik, Form, Field, FormikValues } from 'formik';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/app/constants/common.constants';
import { pubsub } from '@/app/services/pubsub.service';
import * as Yup from 'yup';
import { Proposal } from '@/app/proposal/page';

interface ProposalStep3Props {
  initialValues?: Proposal | null;
  onSubmit: (values: any) => void;
  onPrevious: () => void;
  readOnly?: boolean; // Added prop for read-only mode
}

const ProposalStep3: React.FC<ProposalStep3Props> = ({ initialValues, onSubmit, onPrevious, readOnly = false }) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const [isChecked, setIsChecked] = useState(false); // State to manage checkbox

  // Get current date
  const currentDate = dayjs(new Date()).format(DATE_FORMAT);

  return (
    <Formik
      initialValues={(initialValues || {
        otherCommitments: '',
        progressReportTemplate: '',
        milestones: '',
        totalDaysCompletion: '',
        labStrengths: '',
        externalEquipment: '',
        pilotProductionTesting: '',
        mentoringRequired: '',
      }) as FormikValues}
      validationSchema={Yup.object({
        otherCommitments: Yup.string().required('Other Commitments is required'),
        progressReportTemplate: Yup.string().required('Progress Report Template is required'),
        milestones: Yup.string().required('Milestones is required'),
        totalDaysCompletion: Yup.string().required('Expected Total Number of Days is required'),
        labStrengths: Yup.string().required('Strengths of the Lab, Equipment, and Infrastructure is required'),
        externalEquipment: Yup.string().required('External Equipment Needed is required'),
        pilotProductionTesting: Yup.string().required('Pilot Production and Testing is required'),
        mentoringRequired: Yup.string().required('Specific Mentoring is required'),
      })}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ handleSubmit, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1 }}>
            <Box>
              <Field
                name="otherCommitments"
                color='secondary'
                rows={4}
                as={TextField}
                label="Other Commitments of the Proposal Owner and Time Share on the Project"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.otherCommitments && Boolean(errors.otherCommitments)} sx={{ color: 'red' }}>
                {errors.otherCommitments?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                color='secondary'
                rows={4}
                name="progressReportTemplate"
                as={TextField}
                label="Progress Report Template and Periodicity"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.progressReportTemplate && Boolean(errors.progressReportTemplate)} sx={{ color: 'red' }}>
                {errors.progressReportTemplate?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="milestones"
                as={TextField}
                label="Milestones"
                color='secondary'
                rows={4}
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.milestones && Boolean(errors.milestones)} sx={{ color: 'red' }}>
                {errors.milestones?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="totalDaysCompletion"
                color='secondary'
                rows={4}
                as={TextField}
                multiline
                label="Expected Total Number of Days for R&D Project Completion"
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.totalDaysCompletion && Boolean(errors.totalDaysCompletion)} sx={{ color: 'red' }}>
                {errors.totalDaysCompletion?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="labStrengths"
                color='secondary'
                rows={4}
                as={TextField}
                label="Strengths of the Lab, Equipment, and Infrastructure (Equipment Number/ID)"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.labStrengths && Boolean(errors.labStrengths)} sx={{ color: 'red' }}>
                {errors.labStrengths?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="externalEquipment"
                color='secondary'
                rows={4}
                as={TextField}
                label="External Equipment Needed from Other Institutes or National Facilities"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.externalEquipment && Boolean(errors.externalEquipment)} sx={{ color: 'red' }}>
                {errors.externalEquipment?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="pilotProductionTesting"
                color='secondary'
                rows={4}
                as={TextField}
                label="Pilot Production and Testing - Facilities Available or Support Needed"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.pilotProductionTesting && Boolean(errors.pilotProductionTesting)} sx={{ color: 'red' }}>
                {errors.pilotProductionTesting?.toString()}
              </FormHelperText>
            </Box>

            <Box>
              <Field
                name="mentoringRequired"
                color='secondary'
                rows={4}
                as={TextField}
                label="Specific Mentoring by Industry Partner Required?"
                multiline
                fullWidth
                disabled={readOnly}
              />
              <FormHelperText error={touched.mentoringRequired && Boolean(errors.mentoringRequired)} sx={{ color: 'red' }}>
                {errors.mentoringRequired?.toString()}
              </FormHelperText>
            </Box>

            {/* Statement of Agreement */}
            {!readOnly && <Box sx={{ mt: 4, borderTop: '1px solid #ccc', pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom align="center">
                STATEMENT OF AGREEMENT
              </Typography>

              {/* Wrapping the checkbox and text in a single flex container */}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                  control={<Checkbox color='secondary' checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />}
                  label=""
                  sx={{ mr: 1 }} // Adjust margin to align properly with the text
                />
                <Typography variant="body1" paragraph>
                  By checking the checkbox, I declare that, to the best of my knowledge, the information
                  provided in this form is correct. I understand that if any false
                </Typography>
              </Box>
              <Box>
                <Typography>
                  information is given, or any
                  material fact suppressed, my profile may be terminated.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 2 }}>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">
                  Full Name: {userDetails.firstName} {userDetails.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" fontWeight="bold" mt={1}>
                  Current Date: {currentDate}
                </Typography>
              </Box>


              {/* Checkbox for Agreement */}

            </Box>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={onPrevious}>Back</Button>
              <Button type="submit" variant="contained" disabled={readOnly || !isChecked}>
                Submit
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProposalStep3;
