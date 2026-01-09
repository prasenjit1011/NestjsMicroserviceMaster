// src/stock/stock.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Stock extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
