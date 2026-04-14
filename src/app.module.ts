import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { LogsModule } from './common/logs/logs.module';

@Module({
  imports: [AuthModule, TaskModule, LogsModule],  
  controllers: [],                    
  providers: [],                  
})
export class AppModule {}