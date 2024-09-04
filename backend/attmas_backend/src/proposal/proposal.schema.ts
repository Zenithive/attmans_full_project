import { Schema, Document } from 'mongoose';
import {
  PROPOSAL_STATUSES,
  APPLY_STATUSES,
} from 'src/common/constant/status.constant';

// Define the schema for the proposal data
export const ProposalSchema = new Schema({
  industryProblem: { type: String, required: false },
  impactProductOutput: { type: String, required: false },
  natureOfProject: { type: String, required: false },
  haveTechnology: { type: String, required: false },
  patentPreference: { type: String, required: false },
  projectObjective: { type: String, required: false },
  projectOutline: { type: String, required: false },
  marketNiche: { type: String, required: false },

  isPeerReviewed: { type: String, required: false },
  expectedOutcome: { type: String, required: false },
  detailedMethodology: { type: String, required: false },
  physicalAchievements: { type: String, required: false },

  budgetOutlay: [
    {
      head: { type: String, required: false },
      firstYear: { type: String, required: false },
      secondYear: { type: String, required: false },
      thirdYear: { type: String, required: false },
      total: { type: String, required: false },
    },
  ],

  manpowerDetails: [
    {
      designation: { type: String, required: false },
      monthlySalary: { type: String, required: false },
      firstYear: { type: String, required: false },
      secondYear: { type: String, required: false },
      totalExpenditure: { type: String, required: false },
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

  // New fields added
  userID: { type: String, required: false },
  userName: { type: String, required: false },
  projectId: { type: String, required: false },
  applyId: { type: String, required: false },
  projectTitle: { type: String, required: false },
  projectCurrency: { type: String, required: false },
  Status: { type: String, required: false },
  firstname: { type: String, required: false },
  lastname: { type: String, required: false },
  comment: { type: String, required: false },
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

  // New fields added to the interface
  userID?: string;
  userName?: string;
  projectId: string;
  applyId: string;
  projectTitle: string;
  projectCurrency: string;
  Status: string;
  firstname: string;
  lastname: string;
  comment: string;
}

// ProposalSchema.post('save', async function (doc: Proposal) {
//   const ApplyModel = this.model('Apply') as Model<Apply>;

//   if (doc.Status === PROPOSAL_STATUSES.pending) {
//     console.log(
//       'doc.Status === PROPOSAL_STATUSES.pending',
//       doc.Status === PROPOSAL_STATUSES.pending,
//     );

//     console.log('userId:', doc.userID);
//     console.log('ApplyId', doc.applyId);
//     console.log(
//       'Updating ApplyModel where status is:',
//       APPLY_STATUSES.pendingForApproval,
//     );
//     try {
//       const result = await ApplyModel.updateOne(
//         {
//           userId: doc.userID,
//           _id: doc.applyId,
//           status: APPLY_STATUSES.approvedPendingForProposal,
//         },
//         { $set: { status: APPLY_STATUSES.proposalApprovalPending } },
//       ).exec();

//       console.log('Update result:', result);
//     } catch (error) {
//       console.error('Error updating ApplyModel:', error);
//     }
//   }
//   console.log(
//     'doc.Status === PROPOSAL_STATUSES.proposalUnderReview',
//     doc.Status === PROPOSAL_STATUSES.proposalUnderReview,
//   );
//   if (doc.Status === PROPOSAL_STATUSES.proposalUnderReview) {
//     console.log(
//       'Proposal approved, updating ApplyModel status to proposalUnderReview',
//     );
//     try {
//       const result = await ApplyModel.updateOne(
//         {
//           userId: doc.userID,
//           _id: doc.applyId,
//           status: APPLY_STATUSES.proposalApprovalPending,
//         },
//         { $set: { status: APPLY_STATUSES.proposalUnderReview } },
//       ).exec();

//       console.log('Update result:', result);
//     } catch (error) {
//       console.error('Error updating ApplyModel:', error);
//     }
//   }
// });

ProposalSchema.post('save', async function (doc: Proposal) {
  const ApplyModel = this.model('Apply');
  const statusMatchObj = {
    [PROPOSAL_STATUSES.pending]: APPLY_STATUSES.proposalApprovalPending,
    [PROPOSAL_STATUSES.proposalUnderReview]: APPLY_STATUSES.proposalUnderReview,
    [PROPOSAL_STATUSES.approvedAndAwarded]: APPLY_STATUSES.awarded,
    [PROPOSAL_STATUSES.rejected]: APPLY_STATUSES.rejected,
  };
  console.log('statusMatchObj', statusMatchObj);

  console.log(this, 'doc.Status:', doc.Status);
  try {
    const result = await ApplyModel.updateOne(
      {
        _id: doc.applyId,
      },
      { $set: { status: statusMatchObj[doc.Status] } },
    ).exec();
    console.log('Update result:', result);
  } catch (error) {
    console.error('Error updating ApplyModel:', error);
  }
});

ProposalSchema.post('findOneAndUpdate', async function (doc: Proposal) {
  const ApplyModel = new this.model('Apply');
  const statusMatchObj = {
    [PROPOSAL_STATUSES.pending]: APPLY_STATUSES.proposalApprovalPending,
    [PROPOSAL_STATUSES.proposalUnderReview]: APPLY_STATUSES.proposalUnderReview,
    [PROPOSAL_STATUSES.approvedAndAwarded]: APPLY_STATUSES.awarded,
    [PROPOSAL_STATUSES.rejected]: APPLY_STATUSES.rejected,
  };
  console.log('statusMatchObj', statusMatchObj);

  console.log(this, 'doc.Status:', doc.Status);
  try {
    const result = await ApplyModel.updateOne(
      {
        _id: doc.applyId,
      },
      { $set: { status: statusMatchObj[doc.Status] } },
    ).exec();
    console.log('Update result:', result);
  } catch (error) {
    console.error('Error updating ApplyModel:', error);
  }
});
