import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersCommandService } from '../application/users-command.service';
import { UsersService } from '../application/users.service';
import { UsersController } from '../presentation/users.controller';
import { KafkaService } from '../../kafka/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCommandService,
    KafkaService, 
  ],
  exports: [UsersService, UsersCommandService, KafkaService],
})
export class UsersModule {}
