import React from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Formik, Form, Field } from 'formik';

const ProposalStep1 = ({ onNext }: { onNext: (values: any) => void }) => {
    return (
        <Formik
            initialValues={{
                industryProblem: '',
                impactProductOutput: '',
                natureOfProject: '',
                haveTechnology: '',
                patentPreference: '',
                projectObjective: '',
                projectOutline: '',
                marketNiche: ''
            }}
            onSubmit={(values) => onNext(values)}
        >
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', margin: 'auto' }}>


                        <Field
                            name="industryProblem"
                            as={TextField}
                            label="Industry problem, aim and brief project summary"
                            multiline
                            rows={4}
                        />

                        <Field
                            name="impactProductOutput"
                            as={TextField}
                            label="Impact/Product output envisaged with potential benefits"
                            multiline
                            rows={4}
                        />

                        <Box>
                            <label>Nature of Project solving the Industry problem partially or fully:</label>
                            <RadioGroup name="natureOfProject">
                                <FormControlLabel
                                    value="rde"
                                    control={<Radio />}
                                    label="Research, Development & Engineering (R,D & E) leading to production capability"
                                />
                                <FormControlLabel
                                    value="rdd"
                                    control={<Radio />}
                                    label="Application oriented Research, Design and Development (R,D&D) having production potential"
                                />
                                <FormControlLabel
                                    value="basicRD"
                                    control={<Radio />}
                                    label="Basic R&D addressing the Industry problem but needs efforts to take it to applied research or production capability"
                                />
                                <FormControlLabel
                                    value="haveTechnology"
                                    control={<Radio />}
                                    label="Do you already have a technology that meets the requirement of the industry problem statement shared? If yes, can you elaborate?"
                                />
                            </RadioGroup>
                        </Box>

                        <Field
                            name="haveTechnology"
                            as={TextField}
                            label="If yes, please elaborate the details of the technology and how you would like to undertake the technology transfer or manufacture for the industry partner."
                            multiline
                            rows={4}
                        />

                        <Box>
                            <label>Are you fine if the Patent is as follows:</label>
                            <RadioGroup name="patentPreference">
                                <FormControlLabel
                                    value="industryOnly"
                                    control={<Radio />}
                                    label="Patent is only with the Industry member"
                                />
                                <FormControlLabel
                                    value="jointPatent"
                                    control={<Radio />}
                                    label="Joint patent with Industry member"
                                />
                                <FormControlLabel
                                    value="publicPatent"
                                    control={<Radio />}
                                    label="Public patent which means anyone can use the technology for larger good"
                                />
                            </RadioGroup>
                        </Box>

                        <Field
                            name="projectObjective"
                            as={TextField}
                            label="Objective of the Project"
                            multiline
                            rows={4}
                        />

                        <Field
                            name="projectOutline"
                            as={TextField}
                            label="Brief outline of the project with specific technology fall-outs"
                            multiline
                            rows={4}
                        />

                        <Field
                            name="marketNiche"
                            as={TextField}
                            label="Is there a defined niche for this project? Is there a defined marketable advantage over what is currently on the market?"
                            multiline
                            rows={4}
                        />

                        <Button type="submit" variant="contained">Next</Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default ProposalStep1;
