// src/company/company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
