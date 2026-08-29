import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HealthReadingDocument = HealthReading & Document;

@Schema({ timestamps: true })
export class HealthReading {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true })
  heartRate: number;

  @Prop({ required: true })
  spo2: number;

  @Prop({ required: true })
  bodyTemperature: number;

  @Prop({ required: true })
  activity: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const HealthReadingSchema = SchemaFactory.createForClass(HealthReading);
