import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString({ message: 'El nombre es requerido' })
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'El apellido es requerido' })
  @MaxLength(100)
  @MinLength(3)
  lastname: string;

  @IsNotEmpty()
  @IsString({ message: 'El username es requerido' })
  @MaxLength(50)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(6)
  password: string;
}