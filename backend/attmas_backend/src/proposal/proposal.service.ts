import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal } from './proposal.schema';
import {
  APPLY_STATUSES,
  PROPOSAL_STATUSES,
} from 'src/common/constant/status.constant';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel(Apply.name) private applyModel: Model<ApplyDocument>,
  ) {}

  async createProposal(createProposalDto: any): Promise<Proposal> {
    const existingProposalFromUser = await this.proposalModel
      .findOne({
        userId: createProposalDto.userId,
        applyId: createProposalDto.applyId,
      })
      .exec();
    console.log('existingProposalFromUser', existingProposalFromUser);
    if (existingProposalFromUser) {
      throw new Error('You have already created a proposal for this project.');
    }

    // const existingProposalForProject = await this.proposalModel
    //   .findOne({
    //     projectId: createProposalDto.projectId,
    //   })
    //   .exec();

    // if (existingProposalForProject) {
    //   throw new Error(
    //     'A proposal has already been created for this project by another user.',
    //   );
    // }
    createProposalDto.Status = PROPOSAL_STATUSES.pending;

    const createdProposal = new this.proposalModel(createProposalDto);

    return createdProposal.save();
  }
  // async hasSubmittedProposal(
  //   userID: Types.ObjectId,
  //   applyId: Types.ObjectId,
  // ): Promise<boolean> {
  //   const proposal = await this.proposalModel
  //     .findOne({ userID, applyId })
  //     .exec();
  //   console.log('proposal', proposal);
  //   return !!proposal;
  // }

  async findAllProposal(): Promise<Proposal[]> {
    try {
      const results = await this.proposalModel
        .aggregate([
          {
            $lookup: {
              from: 'jobs', // The collection to join with
              localField: 'projectTitle', // Field from proposals collection to match
              foreignField: 'title', // Field from jobs collection to match
              as: 'jobDetails', // Alias for the joined data
            },
          },
          {
            $unwind: {
              path: '$jobDetails', // Flatten the jobDetails array
              preserveNullAndEmptyArrays: true, // Keep proposals without matching jobs
            },
          },
          {
            $lookup: {
              from: 'applies',
              localField: 'applyId',
              foreignField: '_id',
              as: 'applyDetails',
            },
          },
          {
            $unwind: {
              path: '$applyDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          { $limit: 10 },
          {
            $project: {
              jobDetails: 1, // Optionally exclude jobDetails if not needed
              // 'firstname': 1, // Include the added fields explicitly
              // 'lastname': 1,
              // Include all other fields from the proposals document explicitly
              applyDetails: { _id: 1, status: 1 },
              industryProblem: 1,
              impactProductOutput: 1,
              natureOfProject: 1,
              haveTechnology: 1,
              patentPreference: 1,
              projectObjective: 1,
              projectOutline: 1,
              marketNiche: 1,
              isPeerReviewed: 1,
              expectedOutcome: 1,
              detailedMethodology: 1,
              physicalAchievements: 1,
              budgetOutlay: 1,
              manpowerDetails: 1,
              pastCredentials: 1,
              briefProfile: 1,
              proposalOwnerCredentials: 1,
              otherCommitments: 1,
              progressReportTemplate: 1,
              milestones: 1,
              totalDaysCompletion: 1,
              labStrengths: 1,
              externalEquipment: 1,
              pilotProductionTesting: 1,
              mentoringRequired: 1,
              userID: 1,
              userName: 1,
              projectId: 1,
              applyId: 1,
              projectTitle: 1,
              firstname: 1,
              lastname: 1,
              Status: 1,
              comment: 1,
              // Include any other fields from your proposal schema
            },
          },
        ])
        .exec();

      return results;
    } catch (error) {
      console.error('Error during aggregation:', error);
      throw error;
    }
  }

  async findOneProposal(id: string): Promise<Proposal> {
    return this.proposalModel.findById(id).exec();
  }

  async updateProposal(id: string, updateProposalDto: any): Promise<Proposal> {
    return this.proposalModel
      .findByIdAndUpdate(id, updateProposalDto, { new: true })
      .exec();
  }

  async deleteProposal(id: string): Promise<any> {
    return this.proposalModel.findByIdAndDelete(id).exec();
  }

  async updateStatusProposal(
    id: string,
    status: 'Approved' | 'Rejected',
    comment: string,
  ): Promise<Proposal> {
    const proposal = await this.proposalModel.findById(id).exec();
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    if (
      proposal.Status === PROPOSAL_STATUSES.proposalUnderReview ||
      proposal.Status === PROPOSAL_STATUSES.rejected
    ) {
      throw new ConflictException(
        'Proposal has already been approved or rpejected',
      );
    }

    const newStatus =
      status === 'Approved'
        ? PROPOSAL_STATUSES.proposalUnderReview
        : PROPOSAL_STATUSES.rejected;

    const updatedProposal = await this.proposalModel
      .findByIdAndUpdate(
        id,
        { Status: newStatus, comment: comment },
        { new: true },
      )
      .exec();

    const statusMatchObj = {
      [PROPOSAL_STATUSES.pending]: APPLY_STATUSES.proposalApprovalPending,
      [PROPOSAL_STATUSES.proposalUnderReview]:
        APPLY_STATUSES.proposalUnderReview,
      [PROPOSAL_STATUSES.approvedAndAwarded]: APPLY_STATUSES.awarded,
      [PROPOSAL_STATUSES.rejected]: APPLY_STATUSES.rejected,
    };

    try {
      const result = await this.applyModel
        .updateOne(
          {
            _id: proposal.applyId,
          },
          { $set: { status: statusMatchObj[newStatus] } },
        )
        .exec();

      console.log('ApplyModel update result:', result);
    } catch (error) {
      console.error('Error updating ApplyModel:', error);
    }

    return updatedProposal;
  }
}
