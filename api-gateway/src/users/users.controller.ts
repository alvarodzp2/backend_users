import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { KafkaService } from '../kafka/kafka.service';


@Controller('users')
export class UsersController {
  private readonly microserviceUrl = 'http://localhost:3001/users';  //apunta al puerto donde esta corriendo microservices

  constructor(private readonly httpService: HttpService, private readonly kafkaService: KafkaService,) {}

  @Get()
  async getAll() {
    const res = await this.httpService.axiosRef.get(this.microserviceUrl);
    return res.data;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const res = await this.httpService.axiosRef.get(`${this.microserviceUrl}/${id}`);
    return res.data;
  }

  @Post()
  async create(@Body() data: any) {
    const res = await this.httpService.axiosRef.post(this.microserviceUrl, data);
    return res.data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    const res = await this.httpService.axiosRef.put(`${this.microserviceUrl}/${id}`, data);
    return res.data;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.httpService.axiosRef.delete(`${this.microserviceUrl}/${id}`);
    return res.data;
  }
}
