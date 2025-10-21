import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../infrastructure/user.entity';
import { UserAggregate } from '../domain/aggregates/user.aggregate';
import { KafkaService } from '../../kafka/kafka.service';
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from '../domain/events/user.event';

@Injectable()
export class UsersCommandService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(data: Partial<UserEntity>) {
    if (!data.first_name || !data.last_name || !data.email || !data.cedula) {
      throw new Error('Faltan datos obligatorios para crear el usuario');
    }

    const { aggregate, event } = await UserAggregate.create({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      cedula: data.cedula,
      role: data.role,
      status: data.status,
    });

    const entity = this.userRepository.create({
      first_name: aggregate.firstName,
      last_name: aggregate.lastName,
      email: aggregate.email,
      cedula: aggregate.cedula,
      role: aggregate.role,
      status: aggregate.status,
    });

    await this.userRepository.save(entity);

    await this.kafkaService.sendEvent('users-events', {
      type: 'CREATE_USER',
      userId: aggregate.id,
      payload: event.payload,
    });

    return entity;
  }

  async update(id: string, data: Partial<UserEntity>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const aggregate = new UserAggregate(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.cedula,
      user.role,
      user.status,
    );

    const event = aggregate.update({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      status: data.status,
    });

    Object.assign(user, {
      first_name: aggregate.firstName,
      last_name: aggregate.lastName,
      email: aggregate.email,
      role: aggregate.role,
      status: aggregate.status,
    });

    await this.userRepository.save(user);

    await this.kafkaService.sendEvent('users-events', {
      type: 'UPDATE_USER',
      userId: aggregate.id,
      payload: event.payload,
    });

    return user;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const aggregate = new UserAggregate(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.cedula,
      user.role,
      user.status,
    );

    const event = aggregate.delete();
    user.status = aggregate.status;

    await this.userRepository.save(user);

    await this.kafkaService.sendEvent('users-events', {
      type: 'DELETE_USER',
      userId: aggregate.id,
    });

    return user;
  }
}
