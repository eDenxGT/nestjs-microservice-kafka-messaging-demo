import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DeadLetterMessage extends Document {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  errorMessage: string;

  @Prop({ required: true })
  movedToDLQAt: Date;

  @Prop({ default: 'client-messages' })
  originalTopic: string;
}

export const DeadLetterMessageSchema =
  SchemaFactory.createForClass(DeadLetterMessage);
export type DLQDocument = DeadLetterMessage & Document;
