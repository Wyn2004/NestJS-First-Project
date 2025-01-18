import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO, RegisterUserDTO } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  hashPassword = async (password: string) => {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
  };

  async registerUser(requestBody: RegisterUserDTO): Promise<any> {
    const user = await this.userService.findUserByEmail(requestBody.email);
    if (user) {
      throw new BadRequestException('Email already exists!!!');
    }

    const hashPassword = await this.hashPassword(requestBody.password);
    requestBody.password = hashPassword;
    const newUser = await this.userService.createUser(requestBody);

    const payload = {
      id: newUser.id,
      firstName: newUser.firstName,
      email: newUser.email,
      password: newUser.password,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      msg: 'Register successfully',
      access_token: `Bearer ${access_token}`,
    };
  }

  async loginUser(requestBody: LoginUserDTO): Promise<any> {
    const user = await this.userService.findUserByEmail(requestBody.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMath = await bcrypt.compare(requestBody.password, user.password);
    if (!isMath) {
      throw new BadRequestException('Password incorrect');
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'Login successfully',
      access_token: `Bearer ${access_token}`,
    };
  }
}
