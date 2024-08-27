import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';

const ProposalStep2 = ({ onNext, onPrevious }: { onNext: (values: any) => void, onPrevious: () => void }) => {
  return (
    <Formik
      initialValues={{
        isPeerReviewed: '',
        expectedOutcome: '',
        detailedMethodology: '',
        physicalAchievements: '',
        budgetOutlay: [
          { head: 'Capital Equipment', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Consumable Stores', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Duty on Import', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Manpower', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Travel & Training', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Contingencies', firstYear: '', secondYear: '', thirdYear: '', total: '' },
          { head: 'Overheads', firstYear: '', secondYear: '', thirdYear: '', total: '' },
        ],
        manpowerDetails: [
          { designation: '', monthlySalary: '', firstYear: '', secondYear: '', totalExpenditure: '' },
        ],
        pastCredentials: '',
        briefProfile: '',
        proposalOwnerCredentials: '',
      }}
      onSubmit={(values) => onNext(values)}
    >
      {({ values, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Field name="isPeerReviewed" as={TextField} label="Is this proposal peer reviewed?" fullWidth />
            <Field name="expectedOutcome" as={TextField} label="Expected Outcome in Physical Terms" fullWidth multiline />
            <Field name="detailedMethodology" as={TextField} label="Detailed Methodology and Duration of Project" fullWidth multiline />
            <Field name="physicalAchievements" as={TextField} label="Year-wise Break-up of Physical Achievements" fullWidth multiline />

            {/* Budget Outlay Table */}
            <Typography variant="h6">5. Budget Outlay</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Head</TableCell>
                    <TableCell>1st Year (Rs.)</TableCell>
                    <TableCell>2nd Year (Rs.)</TableCell>
                    <TableCell>3rd Year (Rs.)</TableCell>
                    <TableCell>Total (Rs.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="budgetOutlay"
                    render={() => (
                      values.budgetOutlay.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.head}</TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].firstYear`} as={TextField} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].secondYear`} as={TextField} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].thirdYear`} as={TextField} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].total`} as={TextField} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>

            {/* Manpower Details Table */}
            <Typography variant="h6">6. Manpower Details</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Designation</TableCell>
                    <TableCell>Monthly Salary (Rs.)</TableCell>
                    <TableCell>1st Year (Rs.)</TableCell>
                    <TableCell>2nd Year (Rs.)</TableCell>
                    <TableCell>Total Expenditure (Rs.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="manpowerDetails"
                    render={arrayHelpers => (
                      <>
                        {values.manpowerDetails.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].designation`} as={TextField} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].monthlySalary`} as={TextField} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].firstYear`} as={TextField} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].secondYear`} as={TextField} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].totalExpenditure`} as={TextField} />
                            </TableCell>
                          </TableRow>
                        ))}
                        <Button
                          onClick={() =>
                            arrayHelpers.push({
                              designation: '',
                              monthlySalary: '',
                              firstYear: '',
                              secondYear: '',
                              totalExpenditure: ''
                            })
                          }
                        >
                          Add Row
                        </Button>
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>

            <Field name="pastCredentials" as={TextField} label="Past Credentials in Similar Projects" fullWidth multiline />
            <Field name="briefProfile" as={TextField} label="Brief Profile/CV with Roles of Project Team" fullWidth multiline />
            <Field name="proposalOwnerCredentials" as={TextField} label="Credentials of Proposal Owner (e.g., patents, tech transfers)" fullWidth multiline />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onPrevious}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProposalStep2;
