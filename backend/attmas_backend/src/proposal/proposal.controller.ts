import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProposalService } from './proposal.service';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  async create(@Body() createProposalDto: any) {
    return this.proposalService.createProposal(createProposalDto);
  }

  @Get()
  async findAll() {
    return this.proposalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProposalDto: any) {
    return this.proposalService.update(id, updateProposalDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.proposalService.delete(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status, comment }: { status: 'Approved' | 'Rejected'; comment: string }
  ) {
    return this.proposalService.updateStatus(id, status, comment);
  }
}
