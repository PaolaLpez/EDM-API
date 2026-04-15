import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();

  
    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('No autenticado');
    }

    try {
      const payload = this.jwtService.verify(token);

      console.log('PAYLOAD:', payload);

      request['user'] = payload; 
    } catch (error) {
      console.log('JWT ERROR:', error);
      throw new UnauthorizedException('Token inválido');
    }

    return true; 
  }
}