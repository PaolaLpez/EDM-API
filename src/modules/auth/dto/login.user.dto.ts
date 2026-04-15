import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @MinLength(3, { message: 'El username debe tener mínimo 3 caracteres' })
  @MaxLength(20, { message: 'El username debe tener máximo 20 caracteres' })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password: string;
}