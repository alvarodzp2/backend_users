import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'users-microservice',
      brokers: ['localhost:9092'], // Cambiar a 'kafka:9092' si usas Docker
    });
    this.consumer = this.kafka.consumer({ groupId: 'users-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('Kafka Consumer conectado en users-microservice');

    await this.consumer.subscribe({ topic: 'users-events', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const eventValue = message.value?.toString();
        if (!eventValue) return;

        const event = JSON.parse(eventValue);
        // Aquí ya no se llama directamente a UsersCommandService
        console.log('Evento recibido en KafkaService:', event);
      },
    });
  }

  async sendEvent(topic: string, event: any) {
    const producer = this.kafka.producer();
    await producer.connect();

    await producer.send({
      topic,
      messages: [{ key: event.userId || null, value: JSON.stringify(event) }],
    });

    await producer.disconnect();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('Kafka Consumer desconectado en users-microservice');
  }
}
