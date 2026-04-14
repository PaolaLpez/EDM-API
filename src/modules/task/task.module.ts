import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], 
  controllers: [TaskController],
  providers: [TaskService, PrismaService]  
})
export class TaskModule {}