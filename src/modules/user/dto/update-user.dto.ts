import { IsOptional, IsString, MaxLength, MinLength, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre es requerido' })
  @MaxLength(100)
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString({ message: 'El apellido es requerido' })
  @MaxLength(250)
  @MinLength(3)
  lastname?: string;

  @IsOptional()
  @IsString({ message: 'El username es requerido' })
  @MaxLength(100)
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsInt()
  role_id?: number;
}