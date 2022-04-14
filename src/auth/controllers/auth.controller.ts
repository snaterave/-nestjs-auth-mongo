import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local')) // 'local' es la strategia de autenticacion que se usa en este caso
  @Post('login')
  login(@Req() req: Request) {
    // Al aprobar el Guard, se obtiene el usuario, es decir, el objeto User
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }
}
