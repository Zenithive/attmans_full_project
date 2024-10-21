import { Controller, Request, Post, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auths.service';
import { LocalAuthGuard } from './guards/local-auths.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return { user: req.user._doc, ...token };
  }

  @Post('logout')
  async logout(@Request() req, @Response() res) {
    try {
      const result = await this.authService.logout(req, res);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
