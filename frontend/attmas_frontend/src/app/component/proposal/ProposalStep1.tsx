import React from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, FormHelperText, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FormikValues } from 'formik';
import * as Yup from 'yup';
import { Proposal } from '@/app/proposal/page';

export interface formValues {
    isPeerReviewed?: string;
    expectedOutcome?: string;
    detailedMethodology?: string;
    manpowerDetails?: string;
    pastCredentials?: string;
    briefProfile?: string;
    proposalOwnerCredentials?: string;
    physicalAchievements?: string;
    budgetOutlay?: string;
}

interface ProposalStep1Props {
    initialValues?: Proposal |formValues |  null;
    onNext: (values: any) => void;
    readOnly?: boolean; // Add readOnly prop
}

const ProposalStep1: React.FC<ProposalStep1Props> = ({ onNext, initialValues, readOnly }) => {
    
    return (
        <Formik
            initialValues={(initialValues || {
                industryProblem: '',
                impactProductOutput: '',
                natureOfProject: '',
                haveTechnology: '',
                patentPreference: '',
                projectObjective: '',
                projectOutline: '',
                marketNiche: ''
            }) as FormikValues}
            validationSchema={Yup.object({
                natureOfProject: Yup.string().required('Nature of Project is required'),
                patentPreference: Yup.string().required('Patent Preference is required'),
            })}
            onSubmit={(values) => onNext(values)}
        >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', margin: 'auto', padding: 1 }}>
                        <Field
                            color='secondary'
                            name="industryProblem"
                            as={TextField}
                            label="Industry problem, aim and brief project summary"
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.industryProblem && !!errors.industryProblem}
                            helperText={<ErrorMessage name="industryProblem" />}
                        />

                        <Field
                        color='secondary'
                            name="impactProductOutput"
                            as={TextField}
                            label="Impact/Product output envisaged with potential benefits"
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.impactProductOutput && !!errors.impactProductOutput}
                            helperText={<ErrorMessage name="impactProductOutput" />}
                        />

                        <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Nature of Project solving the Industry problem partially or fully:
                            </Typography>
                            <RadioGroup
                                name="natureOfProject"
                                value={values?.natureOfProject || ''}
                                onChange={(e) => setFieldValue('natureOfProject', e.target.value)}
                            >
                                <FormControlLabel
                                    value="Research, Development & Engineering (R,D & E) leading to production capability"
                                    control={<Radio color='secondary' />}
                                    label="Research, Development & Engineering (R,D & E) leading to production capability"
                                    disabled={readOnly} // Set disabled
                                />
                                <FormControlLabel
                                    value="Application oriented Research, Design and Development (R,D&D) having production potential"
                                    control={<Radio color='secondary' />}
                                    label="Application oriented Research, Design and Development (R,D&D) having production potential"
                                    disabled={readOnly} // Set disabled
                                />
                                <FormControlLabel
                                    value="Basic R&D addressing the Industry problem but needs efforts to take it to applied research or production capability"
                                    control={<Radio color='secondary' />}
                                    label="Basic R&D addressing the Industry problem but needs efforts to take it to applied research or production capability"
                                    disabled={readOnly} // Set disabled
                                />
                                <FormControlLabel
                                    value="Do you already have a technology that meets the requirement of the industry problem statement shared? If yes, can you elaborate?"
                                    control={<Radio color='secondary' />}
                                    label="Do you already have a technology that meets the requirement of the industry problem statement shared? If yes, can you elaborate?"
                                    disabled={readOnly} // Set disabled
                                />
                            </RadioGroup>
                            <FormHelperText error={touched.natureOfProject && !!errors.natureOfProject}>
                                <ErrorMessage name="natureOfProject" />
                            </FormHelperText>
                        </Box>

                        <Field
                            name="haveTechnology"
                            color='secondary'
                            as={TextField}
                            label="If yes, please elaborate the details of the technology and how you would like to undertake the technology transfer or manufacture for the industry partner."
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.haveTechnology && !!errors.haveTechnology}
                            helperText={<ErrorMessage name="haveTechnology" />}
                        />

                        <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Are you fine if the Patent is as follows:
                            </Typography>
                            <RadioGroup
                            color='secondary'
                                name="patentPreference"
                                value={values.patentPreference}
                                onChange={(e) => setFieldValue('patentPreference', e.target.value)}
                            >
                                <FormControlLabel
                                    value="Patent is only with the Industry member"
                                    control={<Radio color='secondary' />}
                                    label="Patent is only with the Industry member"
                                    disabled={readOnly} // Set disabled
                                />
                                <FormControlLabel
                                    value="Joint patent with Industry member"
                                    control={<Radio color='secondary' />}
                                    label="Joint patent with Industry member"
                                    disabled={readOnly} // Set disabled
                                />
                                <FormControlLabel
                                    value="Public patent which means anyone can use the technology for larger good"
                                    control={<Radio color='secondary' />}
                                    label="Public patent which means anyone can use the technology for larger good"
                                    disabled={readOnly} // Set disabled
                                />
                            </RadioGroup>
                            <FormHelperText error={touched.patentPreference && !!errors.patentPreference}>
                                <ErrorMessage name="patentPreference" />
                            </FormHelperText>
                        </Box>

                        <Field
                            name="projectObjective"
                            color='secondary'
                            as={TextField}
                            label="Objective of the Project"
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.projectObjective && !!errors.projectObjective}
                            helperText={<ErrorMessage name="projectObjective" />}
                        />

                        <Field
                            name="projectOutline"
                            color='secondary'
                            as={TextField}
                            label="Brief outline of the project with specific technology fall-outs"
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.projectOutline && !!errors.projectOutline}
                            helperText={<ErrorMessage name="projectOutline" />}
                        />

                        <Field
                            name="marketNiche"
                            color='secondary'
                            as={TextField}
                            label="Is there a defined niche for this project? Is there a defined marketable advantage over what is currently on the market?"
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: readOnly }} // Set readOnly
                            error={touched.marketNiche && !!errors.marketNiche}
                            helperText={<ErrorMessage name="marketNiche" />}
                        />

                            <Button type="submit" variant="contained" sx={{ width: '50%', margin: 'auto' }}>
                                Next
                            </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default ProposalStep1;
