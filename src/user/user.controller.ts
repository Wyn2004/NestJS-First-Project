import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/createUser.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  // Get nay la .../user/
  @Post()
  async createUser(@Body() requestBody: CreateUserDTO): Promise<any> {
    return this.userService.createUser(requestBody);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllUser(): Promise<any> {
    return this.userService.findAllUser();
  }

  @Get('/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.findUserById(id);
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: CreateUserDTO,
  ): Promise<any> {
    return this.userService.updateUser(id, requestBody);
  }

  @Delete('/:id')
  async deleteUser(@Param() id: string): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
