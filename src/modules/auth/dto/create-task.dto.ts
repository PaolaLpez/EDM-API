import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateTaskDto {

    @IsNotEmpty()
    @IsString({ message: 'nombre es requerido' })
    @MaxLength(100)
    @MinLength(3)
    @ApiProperty({ description: 'name', example: 'Jose' }) 
    name: string;

    @IsNotEmpty()
    @IsString({ message: 'nombre es requerido' })
    @MaxLength(250)
    @MinLength(3)
    @ApiProperty({ description: 'description', example: 'This is description' }) 
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'priority', example: false }) 
    priority: boolean;

    @IsNumber()
    @IsInt()
    @ApiProperty({ description: 'user_id', example: 1 }) 
    user_id: number;
}