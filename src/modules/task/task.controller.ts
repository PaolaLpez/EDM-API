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
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { NotFoundError } from 'rxjs';
import { Console } from 'console';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update.task.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('api/task')
@ApiTags('Task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public async getTask(
    @Req() req: any
  ): Promise<Task[]> {
    return await this.taskSvc.getTasks(req.user.id);
  }

  @Get(':id')
  @HttpCode(200)
  public async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ): Promise<Task> {
    const result = await this.taskSvc.getTaskById(id, req.user.id);
    console.log(result);
    if (result == undefined) {
      throw new HttpException(
        `Tarea con id ${id} no encontrada o no tienes permiso`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
    //return  await this.taskSvc.getTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'inserta una tarea en la base de datos' })
  public async insertTask(
    @Body() task: CreateTaskDto,
    @Req() req: any
  ): Promise<Task> {
    task.user_id = req.user.id;
    const result = await this.taskSvc.insert(task);

    if (result == undefined) {
      throw new HttpException(
        'Tarea no registrada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Put('/:id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
    @Req() req: any
  ): Promise<Task> {
    console.log('Tarea a actualizar', task);

    return await this.taskSvc.update(id, req.user.id, task);
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ): Promise<Boolean> {
    try{
      await this.taskSvc.delete(id, req.user.id);
    }
    catch(error){
      throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND)
    }

    return true;
  }
}
