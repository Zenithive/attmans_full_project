import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.schema';
import { Types } from 'mongoose';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  async create(@Body() createProposalDto: any) {
    return this.proposalService.createProposal(createProposalDto);
  }

  @Get()
  async findAll() {
    return this.proposalService.findAllProposal();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.proposalService.findOneProposal(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProposalDto: any) {
    return this.proposalService.updateProposal(id, updateProposalDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.proposalService.deleteProposal(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    { status, comment }: { status: 'Approved' | 'Rejected'; comment: string },
  ) {
    return this.proposalService.updateStatusProposal(id, status, comment);
  }

  @Get('/:userID')
  async getProposalByUserId(@Param('userID') userID: string) {
    console.log('userID', userID);
    return this.proposalService.findProposalByUserId(userID);
  }

  @Get('check')
  async checkProposal(
    @Query('userID') userID: string,
    @Query('applyId') applyId: string,
  ): Promise<Proposal | null> {
    console.log('Received userID:', userID);
    console.log('Received applyId:', applyId);

    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(applyId);
    } catch (error) {
      console.error('Invalid applyId format:', error);
      throw new BadRequestException('Invalid applyId format');
    }

    return this.proposalService.findProposalByUserAndApply(userID, objectId);
  }
}
