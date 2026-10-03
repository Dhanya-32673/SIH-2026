import { Module, Global, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthReading, HealthReadingSchema } from './schemas/health-reading.schema';
import { EnvironmentReading, EnvironmentReadingSchema } from './schemas/environment-reading.schema';
import { RiskAssessment, RiskAssessmentSchema } from './schemas/risk-assessment.schema';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { EmergencyEvent, EmergencyEventSchema } from './schemas/emergency-event.schema';
import { DemoSession, DemoSessionSchema } from './schemas/demo-session.schema';

const featureSchemas = [
  { name: HealthReading.name, schema: HealthReadingSchema },
  { name: EnvironmentReading.name, schema: EnvironmentReadingSchema },
  { name: RiskAssessment.name, schema: RiskAssessmentSchema },
  { name: Alert.name, schema: AlertSchema },
  { name: EmergencyEvent.name, schema: EmergencyEventSchema },
  { name: DemoSession.name, schema: DemoSessionSchema },
];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          'mongodb://127.0.0.1:27017/sih_health_companion';
        const logger = new Logger('DatabaseModule');
        logger.log(`Connecting to MongoDB at: ${uri}`);
        return {
          uri,
          lazyConnection: true,
          serverSelectionTimeoutMS: 2000,
          connectTimeoutMS: 2000,
          retryAttempts: 0,
          retryDelay: 500,
          connectionFactory: (connection: any) => {
            connection.on('error', (err: any) => {
              logger.warn(`MongoDB runtime notice: ${err.message}. Seamlessly using in-memory telemetry.`);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(featureSchemas),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
