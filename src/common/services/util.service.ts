import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UtilService {

  constructor(private readonly jwtSvc: JwtService) {}

  // Encriptar contraseña
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  // Validar contraseña
  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Obtener payload del token
  async getPayload(token: string): Promise<any> {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  // Generar token (opcional pero recomendado)
  async generateToken(payload: any): Promise<string> {
    return this.jwtSvc.sign(payload);
  }
}