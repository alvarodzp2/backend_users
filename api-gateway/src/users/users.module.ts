import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [KafkaService],

})
export class UsersModule {}
