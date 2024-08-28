import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';

const ProposalStep3 = ({ onSubmit, onPrevious }: { onSubmit: (values: any) => void, onPrevious: () => void }) => {
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
