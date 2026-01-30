import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { ProductModule } from './product/product.module';
//import { ProductController } from './product/product.controller';
// import { ProductModule } from './product/product.module';
import { DematModule } from './demat/demat.module';
import { CompanyModule } from './company/company.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const mongoUri = configService.get<string>('MONGODB_URI') || 
    //       'mongodb+srv://tester:tester1234@cluster0.hlicuim.mongodb.net/demat?retryWrites=true&w=majority';
        
    //     return {
    //       uri: mongoUri,
    //       retryAttempts: 5,
    //       retryDelay: 3000, // Increased from 1000 to 3000ms
    //       serverSelectionTimeoutMS: 20000, // Increased from 10000 to 20000ms
    //       socketTimeoutMS: 60000, // Increased from 45000 to 60000ms
    //       maxPoolSize: 10,
    //       minPoolSize: 5,
    //       // For VPN connections
    //       ssl: true,
    //       tlsInsecure: false,
    //       connectTimeoutMS: 20000, // Increased from 10000 to 20000ms
    //       // Additional VPN-friendly options
    //       serverMonitoringMode: 'auto',
    //       waitQueueTimeoutMS: 30000,
    //       heartbeatFrequencyMS: 30000,
    //     };
    //   },
    // }),
    // ProductModule,
    // CompanyModule,
    DematModule,
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
