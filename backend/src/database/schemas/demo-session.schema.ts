import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DemoSessionDocument = DemoSession & Document;

@Schema({ timestamps: true })
export class DemoSession {
  @Prop({ required: true, default: 'demo_user_anonymous' })
  userId: string;

  @Prop({ required: true, default: 'NORMAL' })
  currentScenario: string;

  @Prop({ required: true, default: 'NORMAL' })
  disasterMode: string;

  @Prop({ required: true, default: Date.now })
  lastSwitchedAt: Date;
}

export const DemoSessionSchema = SchemaFactory.createForClass(DemoSession);
