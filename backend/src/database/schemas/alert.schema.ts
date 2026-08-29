import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true, enum: ['INFO', 'WARNING', 'CRITICAL'] })
  severity: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  reasons: string[];

  @Prop({ type: [String], default: [] })
  recommendedActions: string[];

  @Prop({ default: false })
  acknowledged: boolean;

  @Prop({ default: null })
  acknowledgedAt: Date;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
