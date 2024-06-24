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
    res.clearCookie('token');
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send('Could not log out, please try again');
        }

        return res.status(200).json({ message: 'Logout success' });
      });
    } else {
      return res.status(200).json({ message: 'Logout success' });
    }
  }
}
