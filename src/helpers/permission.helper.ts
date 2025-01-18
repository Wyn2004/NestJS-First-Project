import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

export class Permission {
  static checkRole(roles: string[], user: User) {
    return roles.includes(user.role);
  }

  static checkUpdateProfile(currentUser: User, idUser: number): boolean {
    // console.log(currentUser.id === idUser);
    if (currentUser.id === idUser) {
      return true;
    }
    if (currentUser.role === 'admin') {
      return true;
    }
    throw new BadRequestException('You are not allowed to update this user');
  }
}
