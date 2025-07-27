import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Producer } from 'kafkajs';
import { kafka, KAFKA_CONSUMER_GROUPS } from './kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  async onModuleInit() {
    try {
      // Khởi tạo producer
      this.producer = kafka.producer();
      await this.producer.connect();
      this.logger.log('Kafka Producer connected');

      // Khởi tạo consumer
      this.consumer = kafka.consumer({
        groupId: KAFKA_CONSUMER_GROUPS.PAYROLL_SERVICE,
      });
      await this.consumer.connect();
      this.logger.log('Kafka Consumer connected');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka:', error);
      this.logger.warn('Running without Kafka - some features may not work');
      // Don't throw error to allow app to start without Kafka
    }
  }

  async onModuleDestroy() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
      }
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      this.logger.log('Kafka connections closed');
    } catch (error) {
      this.logger.error('Error closing Kafka connections:', error);
    }
  }

  // Gửi message
  async sendMessage(topic: string, message: any) {
    if (!this.producer) {
      this.logger.warn('Kafka producer not available - message not sent');
      return;
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: message.id || Date.now().toString(),
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      });
      this.logger.log(`Message sent to topic ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to send message to ${topic}:`, error);
      throw error;
    }
  }

  // Subscribe to topic và xử lý message
  async subscribe(topic: string, callback: (message: any) => Promise<void>) {
    if (!this.consumer) {
      this.logger.warn(
        `Kafka consumer not available - cannot subscribe to ${topic}`,
      );
      return;
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value?.toString() || '{}');
            this.logger.log(`Received message from ${topic}:`, data);
            await callback(data);
          } catch (error) {
            this.logger.error(`Error processing message from ${topic}:`, error);
          }
        },
      });

      this.logger.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to ${topic}:`, error);
      throw error;
    }
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
