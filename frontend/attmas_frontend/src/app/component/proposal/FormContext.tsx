import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProposalStep2Values } from './ProposalStep2';

interface FormContextType {
  formData: ProposalStep2Values; // Adjust type as needed
  setFormData: React.Dispatch<React.SetStateAction<ProposalStep2Values>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider2: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ProposalStep2Values>({
    isPeerReviewed: '',
    expectedOutcome: '',
    detailedMethodology: '',
    physicalAchievements: '',
    budgetOutlay: [
      { head: '', firstYear: '', secondYear: '', thirdYear: '', total: '' }
    ],
    manpowerDetails: [
      { designation: '', monthlySalary: '', firstYear: '', secondYear: '', totalExpenditure: '' }
    ],
    pastCredentials: '',
    briefProfile: '',
    proposalOwnerCredentials: '',
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext2 = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext2 must be used within a FormProvider');
  }
  return context;
};
