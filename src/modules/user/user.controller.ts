import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundError } from 'rxjs';
import { Console } from 'console';
import { User } from '../task/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/user')
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private userSvc: UserService,
    private readonly utilSvc: UtilService
  ) {}

   @Get('prisma')
  public async getUserPrisma(@Req() req: any): Promise<User[]> {
    return await this.userSvc.getUsers(req.user?.id);
  }

  @Get()
  
  public async getUser(@Req() req: any): Promise<User[]> {
    return await this.userSvc.getUsers(req.user?.id);
  }

  @Get('profile')
  @HttpCode(200)
  public async getUserById(
    @Req() req: any,
  ): Promise<User> {
    const id = req.user.id;
    const result = await this.userSvc.getUserById(id);
    console.log(result);
    if (result == undefined) {
      //throw new NotFoundException(`Tarea con id ${id} no encontrada`)
      throw new HttpException(
        `Usuario con id ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
    //return  await this.taskSvc.getTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Inserta un usuario en la base de datos' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    const encryptedPassword = await this.utilSvc.hash(user.password);
    user.password = encryptedPassword;

    const result = await this.userSvc.insert(user); // solo una vez, con await

    if (!result) {
      throw new HttpException('Usuario no registrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }


  @Put('/:id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    console.log('User a actualizado', user);

    return this.userSvc.update(id, user);
  }


    @Delete(':id')
    public async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
      // Buscamos el usuario incluyendo sus tareas
      const user = await this.userSvc.getUserById(id);

      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }

      // Validamos si tiene tareas 
      if (user.tasks && user.tasks.length > 0) {
        throw new HttpException(
          'No se puede eliminar el usuario porque tiene tareas asociadas',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ejecutamos el borrado
      return await this.userSvc.delete(id);
    }

    @Get(':id/tasks')
    @ApiOperation({ summary: 'Obtiene todas las tareas de un usuario específico' })
    public async getTasksByUser(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<any[]> {
      const tasks = await this.userSvc.getTasksByUserId(id);
      
      if (tasks === null) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      
      return tasks;
    }
}
