import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms'; 

@Injectable()
export class UtilService {
  constructor(private jwtService: JwtService) {}

  public async hash(text: string): Promise<string> {
    return await bcrypt.hash(text, 10);
  }

  public async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash); 
  }

  async generateToken(
    payload: object,
    expiresIn: StringValue | number = 60,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }

  async getPayload(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
