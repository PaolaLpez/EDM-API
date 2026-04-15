import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @ApiProperty({ description: 'name', example: 'Jose' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(5, { message: 'La descripción debe tener mínimo 5 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  @ApiProperty({ description: 'description', example: 'This is description' })
  description: string;

  @IsNotEmpty({ message: 'La prioridad es obligatoria' })
  @IsBoolean({ message: 'La prioridad debe ser true o false' })
  @ApiProperty({ description: 'priority', example: false })
  priority: boolean;

  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsInt({ message: 'El user_id debe ser un número entero' })
  @ApiProperty({ description: 'user_id', example: 1 })
  user_id: number;
}