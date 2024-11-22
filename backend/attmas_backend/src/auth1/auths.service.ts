import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    console.log('user', user);

    const sessionId = uuidv4();

    await this.usersService.updateSessionId(user.username, sessionId);
    if (user.userType === '') {
      return {
        isAllProfileCompleted: user.isAllProfileCompleted,
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        mobilenumber: user.mobileNumber,
        usertype: user.userType,
        sessionId: sessionId,
        // _id: user?._id,
      }; // Custom response indicating profile completion is required
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user._doc.username, sub: user._id };

    // Fetch the user's language
    const language = await this.usersService.getUserLanguage(user._doc.username);

    return {
      access_token: this.jwtService.sign(payload),
      language: language,
    };
  } 

  async logout(req: any, res: any): Promise<any> {
    res.clearCookie('token'); // Clear the token cookie
    console.log(`req.session`, req.session);
    if (req.session) {
      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject('Could not log out, please try again');
          } else {
            resolve({ message: 'Logout success' });
          }
        });
      });
    } else {
      return { message: 'Logout success' };
    }
  }
}
