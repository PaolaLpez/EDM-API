import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  Req
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/login.user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  // LOGIN
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verifica las credenciales y genera un JWT y un RefreshToken',
  })
  public async login(@Body() userLogin: AuthDto) {
    return this.authSvc.login(userLogin);
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
  public async refrescarToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('RefreshToken no proporcionado');
    }
    return this.authSvc.refreshToken(refreshToken);
  }

  // 🔥 LOGOUT CORREGIDO
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Cierra sesión eliminando tokens del usuario',
  })
  public async logout(@Req() request: any) {
    const session = request.user;

    await this.authSvc.logout(session.id);

    return { message: 'Logout exitoso' };
  }

  // REGISTER
  @Post('register')
  @ApiOperation({
    summary: 'Registro de usuario',
  })
  register(@Body() data: any) {
    return this.authSvc.register(data);
  }

  // 🔥 FORGOT PASSWORD
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Genera token para recuperación de contraseña',
  })
  async forgotPassword(@Body('userName') userName: string) {
    return this.authSvc.forgotPassword(userName);
  }

  // 🔥 RESET PASSWORD
  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablece la contraseña usando el token',
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.authSvc.resetPassword(token, newPassword);
  }
}