import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskAssessmentDocument = RiskAssessment & Document;

@Schema({ timestamps: true })
export class RiskAssessment {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true, enum: ['NORMAL', 'WARNING', 'CRITICAL'] })
  status: string;

  @Prop({ required: true })
  riskType: string;

  @Prop({ required: true, min: 0, max: 100 })
  riskScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  confidence: number;

  @Prop({ type: [String], default: [] })
  reasons: string[];

  @Prop({ type: [String], default: [] })
  recommendedActions: string[];

  @Prop({ type: Object, default: {} })
  factors: Record<string, number>;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const RiskAssessmentSchema = SchemaFactory.createForClass(RiskAssessment);
