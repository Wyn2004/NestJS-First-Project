import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/helpers/permission.helper';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // lấy roles của decorator
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // lấy request.user đã gắn ở middleware
    const request = context.switchToHttp().getRequest();
    return Permission.checkRole(roles, request.user);
  }
}
