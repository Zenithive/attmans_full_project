import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { AuthenticateGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req) {
    return { User: req.user, msg: 'User logged in' };
  }

  @UseGuards(AuthenticateGuard)
  @Get('test')
  async test() {
    return { msg: 'Test message validate.' };
  }
}
