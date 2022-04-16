import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Role } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // devuelve un arreglo de roles
    const role = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler()); //['admin', 'user']
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest(); // obtiene el request
    const user = request.user as PayloadToken; // {role: 'admin', sub: '123'}
    console.log('user =>', user);
    const isAuth = role.some((role) => role === user.role);
    if (!isAuth) {
      throw new UnauthorizedException('No tienes los permisos necesarios');
    }

    return true;
  }
}
