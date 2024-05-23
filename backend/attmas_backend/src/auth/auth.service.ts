import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      const { username, firstName, lastName } = user;
      return { username, firstName, lastName };
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
