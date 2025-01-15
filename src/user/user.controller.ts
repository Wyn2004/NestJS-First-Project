import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Get nay la .../user/
  @Post()
  async createUser(@Body() requestBody: any): Promise<any> {
    console.log(requestBody);

    return this.userService.createUser(requestBody);
  }
}
