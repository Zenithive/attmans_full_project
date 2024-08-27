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

  async findAll(): Promise<Proposal[]> {
    return this.proposalModel.find().exec();
  }

  async findOne(id: string): Promise<Proposal> {
    return this.proposalModel.findById(id).exec();
  }

  async update(id: string, updateProposalDto: any): Promise<Proposal> {
    return this.proposalModel.findByIdAndUpdate(id, updateProposalDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.proposalModel.findByIdAndDelete(id).exec();
  }
}
