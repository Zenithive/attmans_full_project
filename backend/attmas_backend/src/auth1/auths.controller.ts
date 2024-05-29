import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auths.service';
import { LocalAuthGuard } from './guards/local-auths.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return { user: req.user, ...token };
  }
}
