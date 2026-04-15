import { IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#&!%*?]).+$/, {
    message: 'Contraseña inválida la contraseña es débil: debe tener mayúscula, minúscula, número y símbolo',
  })
  password: string;
}