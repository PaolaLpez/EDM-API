import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthDto } from './dto/login.user.dto';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {
    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!secret || !refreshSecret) {
      throw new Error('JWT_SECRET y JWT_REFRESH_SECRET deben estar configuradas');
    }

    this.jwtSecret = secret;
    this.jwtRefreshSecret = refreshSecret;
  }

  // LOGIN
  async login(userLogin: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { userName: userLogin.userName },
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

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

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

  // PROFILE
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

  // REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtRefreshSecret,
      }) as any;

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

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.jwtRefreshSecret,
        expiresIn: '7d',
      });

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

  // REGISTER 
  async register(data: any) {
    const existingUser = await this.prisma.user.findFirst({
      where: { userName: data.userName }
    });

    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const role = await this.prisma.rol.findFirst({
      where: { description: 'USER' }
    });

    if (!role) {
      throw new Error('No existe rol en la base de datos');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        userName: data.userName,
        password: hashedPassword,
        role_id: role.id,
      }
    });

    return {
      message: "Usuario creado correctamente",
      user: newUser
    };
  }

  // 🔥 FORGOT PASSWORD (CORREGIDO)
  async forgotPassword(userName: string) {
    const user = await this.prisma.user.findFirst({
      where: { userName }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '15m' }
    );

    // 🔥 HASH REAL
    const hash = await bcrypt.hash(token, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { hash }
    });

    return {
      message: 'Token generado',
      token // 👈 solo para pruebas/Postman
    };
  }

  // 🔥 RESET PASSWORD (CORREGIDO)
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user || !user.hash) {
        throw new UnauthorizedException('Token inválido');
      }

      // 🔥 comparar correctamente
      const isValid = await bcrypt.compare(token, user.hash);

      if (!isValid) {
        throw new UnauthorizedException('Token incorrecto');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          hash: null // 🔥 limpiar después de usar
        }
      });

      return {
        message: 'Contraseña actualizada correctamente'
      };

    } catch (error) {
      throw new UnauthorizedException('Token expirado o inválido');
    }
  }
    //  LOGOUT
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        hash: null 
      }
    });

    return {
      message: 'Logout exitoso'
    };
  }
}
