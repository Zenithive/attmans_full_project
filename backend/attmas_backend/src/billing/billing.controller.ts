import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './create-billing.dto';
import { Billing } from './billing.schema';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  async create(@Body() createBillingDto: CreateBillingDto): Promise<Billing> {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  async findAll(): Promise<Billing[]> {
    return this.billingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Billing> {
    return this.billingService.findOne(id);
  }

  @Get('by-apply/:applyId')
  async findByApplyId(@Param('applyId') applyId: string): Promise<Billing[]> {
    return this.billingService.findByApplyId(applyId);
  }
}
