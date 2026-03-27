import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthDto } from './dto/login.user.dto';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!secret || !refreshSecret) {
      throw new Error('JWT_SECRET y JWT_REFRESH_SECRET deben estar configuradas');
    }

    this.jwtSecret = secret;
    this.jwtRefreshSecret = refreshSecret;
  }

  async login(userLogin: AuthDto) {
    // Usar findFirst en lugar de findUnique porque userName no es único en el where de Prisma
    const user = await this.prisma.user.findFirst({
      where: { userName: userLogin.username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(userLogin.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      userName: user.userName,
      role_id: user.role_id,
      created_at: user.created_at,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '60s' });
    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Actualizar refreshToken
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        userName: user.userName,
      }
    };
  }

  async getProfileFromId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { rol: true }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...profile } = user;
    return profile;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Acceso denegado');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new UnauthorizedException('Token inválido');
      }

      const newPayload = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        userName: user.userName,
        role_id: user.role_id,
        created_at: user.created_at,
      };

      const newAccessToken = jwt.sign(newPayload, this.jwtSecret, { expiresIn: '60s' });
      const newRefreshToken = jwt.sign(newPayload, this.jwtRefreshSecret, { expiresIn: '7d' });

      const newHash = await bcrypt.hash(newRefreshToken, 10);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newHash }
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { rol: true }
    });
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    return user;
  }

  async updateHash(user_id: number, hash: string | null) {
    return this.prisma.user.update({
      where: { id: user_id },
      data: { hash: hash }
    });
  }
}