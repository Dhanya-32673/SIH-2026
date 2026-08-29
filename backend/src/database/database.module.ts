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
          serverSelectionTimeoutMS: 2500, // Quick timeout to failover if offline
          connectTimeoutMS: 2500,
          retryAttempts: 2,
          retryDelay: 1000,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(featureSchemas),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
