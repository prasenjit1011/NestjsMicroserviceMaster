// src/demat/demat.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { getPublicPath } from '../utils/path.util';

@Injectable()
export class DematService {
  async getDataFromCsv(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      const filePath = getPublicPath('data/portfoliodata.csv');
      
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

  
  async getTradeDataFromCsv(year): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      const filePath = getPublicPath(`data/trade-${year}.csv`);

      try {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            // Convert string values to numbers
            results.push({
              dtd: data['Date'] || data.dtd || '',
              sid: data['Stock'] || data.sid || '',
              action: data['Action'] || data.name || '',
              price: parseFloat(data['Price'] || data.price || '0') || 0,
              qty: parseInt(data['Qty'] || data.qty || '0') || 0,
              tradevalue: parseFloat(data['Trade Value'] || data.tradevalue || '0') || 0
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
    const filePath = getPublicPath('data/siddata.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  }

  /**
   * Read yearly high/low data from the pre-computed JSON file
   */
  yearlyHighLowData(): Record<string, Record<string, { low: number; high: number }>> {
    try {
      const filePath = getPublicPath('data/sid_yearly_highlow.json');
      
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return {};
      }
      
      const jsonData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading yearly high/low data:', error);
      return {};
    }
  }
}
