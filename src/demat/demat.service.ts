// src/demat/demat.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class DematService {
  async getDataFromCsv(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      const filePath = path.join(__dirname, '../../public/data/data.csv');
      
      try {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            // Convert string values to numbers
            results.push({
              sid: data['Stock Symbol'] || data.sid || '',
              name: data['Company Name'] || data.name || '',
              price: parseFloat(data['Average Cost Price'] || data.price || '0') || 0,
              qty: parseInt(data['Qty'] || data.qty || '0') || 0,
              total: parseFloat(data['Value At Cost'] || data.total || '0') || 0
            });
          })
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  getDataFromJson() {
    const filePath = path.join(__dirname, '../../public/data/siddata.json');
    console.log('CSV filePath', filePath);
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  }
}
