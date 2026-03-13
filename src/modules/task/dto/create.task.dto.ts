import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateTaskDto {

    @IsNotEmpty()
    @IsString({ message: 'nombre es requerido' })
    @MaxLength(100)
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsString({ message: 'nombre es requerido' })
    @MaxLength(250)
    @MinLength(3)
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    priority: boolean;

    @IsNumber()
    @IsInt()
    user_id: number;
}