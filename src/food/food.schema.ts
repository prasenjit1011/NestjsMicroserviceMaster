
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodDocument = Food & Document;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
