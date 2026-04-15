import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
  Res
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/login.user.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  // LOGIN 
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verifica las credenciales y genera un JWT y un RefreshToken',
  })
  public async login(
    @Body() userLogin: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authSvc.login(userLogin);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login exitoso' };
  }

  // PROFILE 
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtiene el perfil del usuario desde el token',
  })
  public async getProfile(@Req() req: any) {
    const id = req.user.id;
    return this.authSvc.getProfileFromId(id);
  }

  // REFRESH TOKEN 
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renueva el token de acceso usando el RefreshToken',
  })
  public async refrescarToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('RefreshToken no proporcionado');
    }

    const tokens = await this.authSvc.refreshToken(refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Token renovado' };
  }

  // LOGOUT 
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Cierra sesión eliminando tokens del usuario',
  })
  public async logout(
    @Req() request: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = request.user;

    await this.authSvc.logout(session.id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logout exitoso' };
  }

  // REGISTER 
  @Post('register')
  register(@Body() data: RegisterDto) {
  return this.authSvc.register(data);
  }

  // FORGOT PASSWORD 
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Genera token para recuperación de contraseña',
  })
  async forgotPassword(@Body('userName') userName: string) {
    return this.authSvc.forgotPassword(userName);
  }

  // RESET PASSWORD 
  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
  return this.authSvc.resetPassword(data.token, data.newPassword);
}
}