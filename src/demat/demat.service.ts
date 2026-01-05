// src/demat/demat.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DematService {
  getDataFromJson() {
    const filePath = path.join(__dirname, '../../public/data/data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  }
}
