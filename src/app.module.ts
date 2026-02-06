import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { TaskModule } from './modules/task/task.module';

@Module({
  controllers: [AuthModule],
  providers: [AuthService],
  imports: [TaskModule],
})
export class AppModule {}
