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
import { Formik, Form, Field, FieldArray, FormikValues } from 'formik';
import { Proposal } from '@/app/proposal/page';

export interface BudgetOutlay {
  head: string;
  firstYear: string;
  secondYear: string;
  thirdYear: string;
  total: string;
}

export interface ManpowerDetail {
  designation: string;
  monthlySalary: string;
  firstYear: string;
  secondYear: string;
  totalExpenditure: string;
}

export interface ProposalStep2Values {
  isPeerReviewed: string;
  expectedOutcome: string;
  detailedMethodology: string;
  physicalAchievements: string;
  budgetOutlay: BudgetOutlay[];
  manpowerDetails: ManpowerDetail[];
  pastCredentials: string;
  briefProfile: string;
  proposalOwnerCredentials: string;
}

interface ProposalStep2Props {
  initialValues?: Proposal | null;
  onNext: (values: ProposalStep2Values) => void;
  onPrevious: () => void;
  readOnly?: boolean; // Added prop for read-only mode
}

const ProposalStep2: React.FC<ProposalStep2Props> = ({ onNext, onPrevious, initialValues, readOnly = false }) => {
  // Default initial values to match ProposalStep2Values
  const defaultValues: ProposalStep2Values = {
    isPeerReviewed: '',
    expectedOutcome: '',
    detailedMethodology: '',
    physicalAchievements: '',
    budgetOutlay: [{ head: '', firstYear: '', secondYear: '', thirdYear: '', total: '' }],
    manpowerDetails: [{ designation: '', monthlySalary: '', firstYear: '', secondYear: '', totalExpenditure: '' }],
    pastCredentials: '',
    briefProfile: '',
    proposalOwnerCredentials: '',
    ...initialValues,
  };

  return (
    <Formik
      initialValues={(initialValues || {
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
      }) as FormikValues}
      onSubmit={(values) => onNext(values as ProposalStep2Values)}
    >
      {({ values, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}>
            <Field
              rows={4}
              color='secondary'
              name="isPeerReviewed"
              as={TextField}
              label="Is this proposal peer reviewed?"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
              sx={{ paddingBottom: 2 }}
            />
            <Field
              rows={4}
              color='secondary'
              name="expectedOutcome"
              as={TextField}
              label="Expected Outcome in Physical Terms"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />
            <Field
              rows={4}
              color='secondary'
              name="detailedMethodology"
              as={TextField}
              label="Detailed Methodology and Duration of Project"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />
            <Field
              rows={4}
              color='secondary'
              name="physicalAchievements"
              as={TextField}
              label="Year-wise Break-up of Physical Achievements"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />

            {/* Budget Outlay Table */}
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Budget Outlay
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Head</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>1st Year </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>2nd Year </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>3rd Year </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="budgetOutlay"
                    render={() => (
                      values.budgetOutlay.map((row: { head: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                        <TableRow key={index}>
                          <TableCell>{row.head}</TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].firstYear`} as={TextField} disabled={readOnly} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].secondYear`} as={TextField} disabled={readOnly} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].thirdYear`} as={TextField} disabled={readOnly} />
                          </TableCell>
                          <TableCell>
                            <Field name={`budgetOutlay[${index}].total`} as={TextField} disabled={readOnly} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>

            {/* Manpower Details Table */}
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Manpower Details
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Monthly Salary </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>1st Year </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>2nd Year </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Expenditure </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="manpowerDetails"
                    render={arrayHelpers => (
                      <>
                        {values.manpowerDetails.map((row: any, index: React.Key | null | undefined) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].designation`} as={TextField} disabled={readOnly} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].monthlySalary`} as={TextField} disabled={readOnly} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].firstYear`} as={TextField} disabled={readOnly} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].secondYear`} as={TextField} disabled={readOnly} />
                            </TableCell>
                            <TableCell>
                              <Field name={`manpowerDetails[${index}].totalExpenditure`} as={TextField} disabled={readOnly} />
                            </TableCell>
                          </TableRow>
                        ))}
                        {!readOnly && (
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
                        )}
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>

            <Field
              color='secondary'
              rows={4}
              name="pastCredentials"
              as={TextField}
              label="Past Credentials in Similar Projects"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />
            <Field
              color='secondary'
              rows={4}
              name="briefProfile"
              as={TextField}
              label="Brief Profile/CV with Roles of Project Team"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />
            <Field
              color='secondary'
              rows={4}
              name="proposalOwnerCredentials"
              as={TextField}
              label="Credentials of Proposal Owner (e.g., patents, tech transfers)"
              fullWidth
              multiline
              disabled={readOnly} // Apply readOnly
            />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onPrevious}>
                Previous
              </Button>
              <Button type="submit" variant="contained" >
                Next
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProposalStep2;
