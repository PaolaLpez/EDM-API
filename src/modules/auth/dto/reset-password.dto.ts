import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {

  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#&!%*?]).+$/, {
    message: 'Contraseña débil: debe tener mayúscula, minúscula, número y símbolo',
  })
  newPassword: string;
}