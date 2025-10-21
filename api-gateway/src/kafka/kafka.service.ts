import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Message } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'api-gateway',
      brokers: ['localhost:9092'], 
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka Producer conectado desde API Gateway');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka Producer desconectado desde API Gateway');
  }

  async sendEvent(topic: string, event: any) {
    const message: Message = {
      key: event.id || null,
      value: JSON.stringify(event),
    };

    await this.producer.send({
      topic,
      messages: [message],
    });

    console.log(`Evento enviado al topic ${topic}:`, event);
  }
}
