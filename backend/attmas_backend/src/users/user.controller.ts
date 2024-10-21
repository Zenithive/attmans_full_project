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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { AuthenticateGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth1/guards/jwt-auths.guard';

@Controller('users')
// @UseGuards(JwtAuthGuard)
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

  @Get('filters')
  async getUsersByUserType(
    @Query('userType') userType: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('categories') categories = '',
    @Query('subCategory') subCategory = '',
    @Query('firstName') firstName = '',
    @Query('lastName') lastName = '',
    @Query('mobileNumber') mobileNumber = '',
    @Query('username') username = '',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const users = await this.usersService.findUsersByUserType({
      userType,
      pageNumber,
      limitNumber,
      categories,
      subCategory,
      firstName,
      lastName,
      mobileNumber,
      username,
    });
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

  @Get('updateEmailStatus/:id')
  async updateEmailStatus(@Param('id') id: string, @Res() res: Response) {
    const updatedUser =
      await this.usersService.updateEmailVerificationStatus(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Redirect to the front-end route with a success message
    return res.redirect(
      `${process.env.BACKEND_BASR_URL}/?message=email_verified`,
    );
  }

  @Post('forgot-password')
  async setForgotPassword(
    @Body('username') username: string,
    @Res() res: Response,
  ) {
    const updatedUser = await this.usersService.setResetPasswordFlag(username);
    if (!updatedUser) {
      throw new NotFoundException(`User with Email: ${username} not found`);
    }
    // Redirect to the front-end route with a success message
    return res.json({ message: 'Check your email to reset password.' });
  }

  @Post('reset-password')
  async resetPassword(
    @Body('resetPasswordId') resetPasswordId: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const updatedUser = await this.usersService.resetUserPassword(
      resetPasswordId,
      password,
    );
    if (!updatedUser) {
      throw new NotFoundException(`This link is not valid`);
    }
    // Redirect to the front-end route with a success message
    return res.json({ message: 'Password is successfully changed.' });
  }
}
