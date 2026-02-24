import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Nestjs lambda_01_cicd_04_sqs_01 : 11June2025 : SQS : 1301 '+(new Date).getMilliseconds();
  }
}
