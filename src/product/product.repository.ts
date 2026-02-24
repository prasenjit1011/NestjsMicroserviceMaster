// src/product/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './product-create.dto';
import { UpdateProductDto } from './product-update.dto';

import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, ChangeMessageVisibilityCommand } from "@aws-sdk/client-sqs";

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }
 

  // const dtd = new Date;
  // const str = 'Dtd : '+dtd.getDate()+' -:- '+dtd.getHours()+':'+dtd.getMinutes()+':'+dtd.getSeconds()+':'+dtd.getMilliseconds();
  // const prodData = {name:"Test - "+str, price:123, description:"Dummy"};
  // const createdProduct  = await new this.productModel(prodData).save();
  // const productList     = await this.productModel.find().select('name').exec();
  // return { message: "Product created", createdProduct, productList};

  async myProd() {
    try{
      const sqs = new SQSClient({ region: "us-east-1" });
      const queueUrl = "https://sqs.us-east-1.amazonaws.com/466015320752/lambdaproductcreate.fifo"; 

      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5, // use 5-10 sec for better long polling
        VisibilityTimeout: 10, // optional: set to short time
        MessageAttributeNames: ["All"], // ensure you get custom attributes
        AttributeNames: ["All"], // helpful for debugging
      });
    
      const response = await sqs.send(command);
  
      if (response.Messages && response.Messages.length > 0) {
        const message = response.Messages[0];
        const body = JSON.parse(message.Body);
    
        // Delete message after processing
        await sqs.send(new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }));
  
        return body;
      } else {
        return { message: "No messages in the myqueue... 7789 : "+(new Date).getMilliseconds(), response};
      }
    }
    catch(e){
      return { message: "Product not created successfully!", error: e.message};
    }

  }
 

  async findAll(): Promise<Product[]> {    

    const dtd = new Date;
    const time = 'Dtd : '+dtd.getDate()+' -:- '+dtd.getHours()+':'+dtd.getMinutes()+':'+dtd.getSeconds()+':'+dtd.getMilliseconds();
    let prod = {
      name: "Test Product 001 : "+time,
      price: 999,
      description: "A demo item",
    }

    const command = new SendMessageCommand({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/466015320752/lambdaproductcreate.fifo",
      MessageBody: JSON.stringify(prod),
      MessageGroupId: "product-group-1"
    });
    const sqs = new SQSClient({ region: "us-east-1" });
    await sqs.send(command);

    
    return this.productModel.find().select('name description').exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }
}
