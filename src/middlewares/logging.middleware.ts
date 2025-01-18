import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      const access_token = req.headers.authorization.split(' ')[1];
      if (!access_token) {
        throw new UnauthorizedException('Please login');
      }
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Error not authorized');
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Please login');
    }
  }
}
