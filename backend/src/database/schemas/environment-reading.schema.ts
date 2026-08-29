import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnvironmentReadingDocument = EnvironmentReading & Document;

@Schema({ timestamps: true })
export class EnvironmentReading {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  pressure: number;

  @Prop({ type: Object, required: true })
  airQuality: {
    aqi: number;
    pm25: number;
    status: string;
  };

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const EnvironmentReadingSchema = SchemaFactory.createForClass(EnvironmentReading);
