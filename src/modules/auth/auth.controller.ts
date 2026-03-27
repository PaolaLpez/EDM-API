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
import { AppException } from 'src/common/exceptions/app.exceptions';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verifica las credenciales y genera un JWT y un RefreshToken',
  })
  public async login(@Body() userLogin: AuthDto) {
    return this.authSvc.login(userLogin);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Extrae el ID del usuario desde el token y busca la información completando el request',
  })
  public async getProfile(@Req() req: any) {
    const id = req.user.id;
    return this.authSvc.getProfileFromId(id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renueva el token de acceso usando el RefreshToken',
  })
  public async refrescarToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('RefreshToken no proporcionado');
    return this.authSvc.refreshToken(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const session = request.user;
    const user = await this.authSvc.updateHash(session.id, null);
    return user;
  }
}