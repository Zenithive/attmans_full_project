import { Schema, Document } from 'mongoose';

// Define the schema for the proposal data
export const ProposalSchema = new Schema({
    industryProblem: { type: String, required: true },
    impactProductOutput: { type: String, required: true },
    natureOfProject: { type: String, required: true },
    haveTechnology: { type: String, required: true },
    patentPreference: { type: String, required: true },
    projectObjective: { type: String, required: true },
    projectOutline: { type: String, required: true },
    marketNiche: { type: String, required: true },

    isPeerReviewed: { type: String, required: true },
    expectedOutcome: { type: String, required: true },
    detailedMethodology: { type: String, required: true },
    physicalAchievements: { type: String, required: true },

    budgetOutlay: [
        {
            head: { type: String, required: true },
            firstYear: { type: String, required: true },
            secondYear: { type: String, required: true },
            thirdYear: { type: String, required: true },
            total: { type: String, required: true },
        },
    ],

    manpowerDetails: [
        {
            designation: { type: String, required: true },
            monthlySalary: { type: String, required: true },
            firstYear: { type: String, required: true },
            secondYear: { type: String, required: true },
            totalExpenditure: { type: String, required: true },
        },
    ],

    pastCredentials: { type: String, required: true },
    briefProfile: { type: String, required: true },
    proposalOwnerCredentials: { type: String, required: true },

    otherCommitments: { type: String, required: true },
    progressReportTemplate: { type: String, required: true },
    milestones: { type: String, required: true },
    totalDaysCompletion: { type: String, required: true },
    labStrengths: { type: String, required: true },
    externalEquipment: { type: String, required: true },
    pilotProductionTesting: { type: String, required: true },
    mentoringRequired: { type: String, required: true },
});

export interface Proposal extends Document {
    industryProblem: string;
    impactProductOutput: string;
    natureOfProject: string;
    haveTechnology: string;
    patentPreference: string;
    projectObjective: string;
    projectOutline: string;
    marketNiche: string;

    isPeerReviewed: string;
    expectedOutcome: string;
    detailedMethodology: string;
    physicalAchievements: string;

    budgetOutlay: Array<{
        head: string;
        firstYear: string;
        secondYear: string;
        thirdYear: string;
        total: string;
    }>;

    manpowerDetails: Array<{
        designation: string;
        monthlySalary: string;
        firstYear: string;
        secondYear: string;
        totalExpenditure: string;
    }>;

    pastCredentials: string;
    briefProfile: string;
    proposalOwnerCredentials: string;

    otherCommitments: string;
    progressReportTemplate: string;
    milestones: string;
    totalDaysCompletion: string;
    labStrengths: string;
    externalEquipment: string;
    pilotProductionTesting: string;
    mentoringRequired: string;
}
