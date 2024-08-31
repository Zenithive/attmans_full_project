import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal } from './proposal.schema';

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
  ) {}

  async createProposal(createProposalDto: any): Promise<Proposal> {
    const createdProposal = new this.proposalModel(createProposalDto);
    return createdProposal.save();
  }

  async findAllProposal(): Promise<Proposal[]> {
    return this.proposalModel
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
        { $limit: 10 },
        {
          $project: {
            jobDetails: 1, // Optionally exclude jobDetails if not needed
            // 'firstname': 1, // Include the added fields explicitly
            // 'lastname': 1,
            // Include all other fields from the proposals document explicitly
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
            userId: 1,
            userName: 1,
            projectId: 1,
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
    return this.proposalModel
      .findByIdAndUpdate(
        id,
        { Status: status, comment: comment },
        { new: true },
      )
      .exec();
  }

  async findProposalById(id: string): Promise<Proposal | null> {
    return this.proposalModel.findById(id).exec();
  }
}
