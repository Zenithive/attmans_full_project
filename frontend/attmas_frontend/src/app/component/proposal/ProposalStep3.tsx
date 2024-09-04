import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/app/constants/common.constants';

const ProposalStep3 = ({ onSubmit, onPrevious }: { onSubmit: (values: any) => void, onPrevious: () => void }) => {

    const userDetails: UserSchema = useAppSelector(selectUserSession);

    // Get current date
    const currentDate = dayjs(new Date()).format(DATE_FORMAT);

    return (
        <Formik
            initialValues={{
                otherCommitments: '',
                progressReportTemplate: '',
                milestones: '',
                totalDaysCompletion: '',
                labStrengths: '',
                externalEquipment: '',
                pilotProductionTesting: '',
                mentoringRequired: '',
            }}
            onSubmit={(values) => onSubmit(values)}
        >
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1 }}>
                        <Field
                            name="otherCommitments"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            label="Other Commitments of the Proposal Owner and Time Share on the Project"
                            multiline
                            fullWidth
                        />
                        <Field
                            color='secondary'
                            rows={4}
                            name="progressReportTemplate"
                            as={TextField}
                            label="Progress Report Template and Periodicity"
                            multiline
                            fullWidth
                        />
                        <Field
                            name="milestones"
                            as={TextField}
                            label="Milestones"
                            color='secondary'
                            rows={4}
                            multiline
                            fullWidth
                        />
                        <Field
                            name="totalDaysCompletion"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            multiline
                            label="Expected Total Number of Days for R&D Project Completion"
                            fullWidth
                        />
                        <Field
                            name="labStrengths"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            label="Strengths of the Lab, Equipment, and Infrastructure (Equipment Number/ID)"
                            multiline
                            fullWidth
                        />
                        <Field
                            name="externalEquipment"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            label="External Equipment Needed from Other Institutes or National Facilities"
                            multiline
                            fullWidth
                        />
                        <Field
                            name="pilotProductionTesting"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            label="Pilot Production and Testing - Facilities Available or Support Needed"
                            multiline
                            fullWidth
                        />
                        <Field
                            name="mentoringRequired"
                            color='secondary'
                            rows={4}
                            as={TextField}
                            label="Specific Mentoring by Industry Partner Required?"
                            multiline
                            fullWidth
                        />

                        {/* Statement of Agreement */}
                        <Box sx={{ mt: 4, borderTop: '1px solid #ccc', pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom align="center">
                                STATEMENT OF AGREEMENT
                            </Typography>
                            <Typography variant="body1" paragraph align="center">
                                By typing my name below, I declare that, to the best of my knowledge, the information
                                provided in this form is correct. I understand that if any false information is given, or any
                                material fact suppressed, my profile may be terminated.
                            </Typography>
                            {/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 2 }}> */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                    Full Name: {userDetails.firstName} {userDetails.lastName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold" mt={1}>
                                    Current Date: {currentDate}
                                </Typography>
                            </Box>

                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button variant="outlined" onClick={onPrevious}>Back</Button>
                            <Button type="submit" variant="contained">Submit</Button>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default ProposalStep3;
