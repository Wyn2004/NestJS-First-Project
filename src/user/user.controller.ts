import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDTO, RegisterUserDTO, UpdateUserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/user.decorator';
import { ROLES, User } from './user.entity';
import { Roles } from './decorator/auth.decorator';
import { RoleGuard } from 'src/guard/auth.guard';

@Controller('/api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  async findAllUser(): Promise<any> {
    return this.userService.findAllUser();
  }

  @Roles(ROLES.ADMIN, ROLES.GUEST)
  @UseGuards(RoleGuard)
  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDTO,
    @CurrentUser() user: User,
  ): Promise<any> {
    return this.userService.updateUser(id, requestBody, user);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RoleGuard)
  @Delete('/:id')
  async deleteUser(@Param() id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }

  @Post('/register')
  async registerUser(@Body() requestBody: RegisterUserDTO): Promise<any> {
    return this.authService.registerUser(requestBody);
  }

  @Post('/login')
  async loginUser(@Body() requestBody: LoginUserDTO): Promise<any> {
    return this.authService.loginUser(requestBody);
  }

  @Get('/profile')
  async getProfile(@CurrentUser() currentUser: User): Promise<any> {
    return currentUser;
  }

  @Get('/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.findUserById(id);
  }

  @Patch('/:id/:role')
  @Roles(ROLES.ADMIN)
  @UseGuards(RoleGuard)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(ROLES)) role: ROLES,
  ): Promise<any> {
    return this.userService.changeRole(id, role);
  }
}
