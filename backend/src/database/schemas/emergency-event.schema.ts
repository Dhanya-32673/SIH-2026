import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmergencyEventDocument = EmergencyEvent & Document;

@Schema({ timestamps: true })
export class EmergencyEvent {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true })
  riskType: string;

  @Prop({
    required: true,
    enum: ['DETECTED', 'COUNTDOWN', 'USER_CONFIRMED_SAFE', 'ESCALATED'],
    default: 'DETECTED',
  })
  state: string;

  @Prop({ type: [String], default: [] })
  triggerFactors: string[];

  @Prop({ type: Object, default: {} })
  snapshotTelemetry: Record<string, any>;

  @Prop({
    type: Object,
    default: {
      latitude: 16.4419,
      longitude: 80.6222,
      accuracy: '5m',
      label: 'SIH Hackathon Campus, Vijayawada, India',
    },
  })
  simulatedLocation: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  triggeredAt: Date;

  @Prop({ default: null })
  resolvedAt: Date;

  @Prop({ default: null })
  escalatedAt: Date;
}

export const EmergencyEventSchema = SchemaFactory.createForClass(EmergencyEvent);
