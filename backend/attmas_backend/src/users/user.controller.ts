import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
  Query,
  NotFoundException,
  Param,
  Put,
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

  @Get('by-type')
  async getUsersByUserType(
    @Query('userType') userType: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('filter') filter = '',
    @Query('category') category = '',
    @Query('subCategory') subCategory = '',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const users = await this.usersService.findUsersByUserType(
      userType,
      pageNumber,
      limitNumber,
      filter,
      category,
      subCategory,
    );
    return users;
  }

  @Get('by-type1')
  async getUsersByUserType1(@Query('userType') userType: string) {
    const usernames = await this.usersService.findUsersByUserType1(userType);
    return usernames;
  }

  @Get('profile')
  async getUserProfile(@Query('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  @Put(':id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUserProfile(
      id,
      updateUserDto,
    );
    return updatedUser;
  }
}
