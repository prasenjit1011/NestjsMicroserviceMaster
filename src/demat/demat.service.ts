// src/demat/demat.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
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

  getIPODataFromJson() {
    const filePath = getPublicPath('data/ipodata.json');
    try {
      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
      } else {
        console.warn(`IPO data file not found: ${filePath}`);
        return [];
      }
    } catch (error) {
      console.error('Error reading IPO data:', error);
      return [];
    }
  }

  /**
   * Get bank transaction data from Excel file for a specific year
   * Reads OpTransactionHistory-{year}.xls from public/transaction folder
   * Skips header/metadata rows and returns only actual transaction data
   */
  async getTransactionsByYear(year: string): Promise<any[]> {
    try {
      const fileName = `OpTransactionHistory-${year}.xls`;
      const filePath = getPublicPath(path.join('transaction', fileName));

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Transaction file not found for year ${year}: ${fileName}`);
      }

      // Read Excel file with raw data (header: 1 means get all rows as arrays)
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // Find the header row and data start
      // The actual transaction data starts after "Transactions List - [Name] - [Account]" row
      let dataStartIndex = -1;
      let legendStartIndex = -1;

      for (let i = 0; i < rawData.length; i++) {
        const row: any = rawData[i];
        // Look for the transactions list header row (contains account name and number)
        if (row.__EMPTY_1 && row.__EMPTY_1.includes('Transactions List')) {
          // The next row is the column headers, data starts 2 rows after "Transactions List"
          dataStartIndex = i + 2;
          // console.log(`Found Transactions List at row ${i}, data starts at ${dataStartIndex}`);
        }
        // Look for the start of legend section
        if (row.__EMPTY_5 && row.__EMPTY_5.includes('Legends Used in Account Statement')) {
          legendStartIndex = i;
          // console.log(`Found Legends at row ${i}`);
          break;
        }
      }

      if (dataStartIndex === -1) {
        console.warn(`No transaction data found in file for year ${year}`);
        return [];
      }

      // Extract transaction data starting from dataStartIndex until legend section
      const transactions: any[] = [];
      let serialNumber = 1;
      const endIndex = legendStartIndex !== -1 ? legendStartIndex : rawData.length;

      // console.log(`Processing rows from ${dataStartIndex} to ${endIndex}`);

      for (let i = dataStartIndex; i < endIndex; i++) {
        const row: any = rawData[i];
        
        // Correct column mapping based on actual Excel structure:
        // __EMPTY_1 = S No.
        // __EMPTY_2 = Value Date
        // __EMPTY_3 = Transaction Date
        // __EMPTY_4 = Cheque Number
        // __EMPTY_5 = Transaction Remarks
        // __EMPTY_6 = Withdrawal Amount(INR)
        // __EMPTY_7 = Deposit Amount(INR)
        // __EMPTY_8 = Balance(INR)
        
        const sNoRaw = (row.__EMPTY_1 || '').toString().trim();
        const valueDate = (row.__EMPTY_2 || '').toString().trim();
        const transactionDate = (row.__EMPTY_3 || '').toString().trim();
        const chequeNumber = (row.__EMPTY_4 || '').toString().trim();
        const remarks = (row.__EMPTY_5 || '').toString().trim();
        const withdrawalAmount = this.parseAmount(row.__EMPTY_6);
        const depositAmount = this.parseAmount(row.__EMPTY_7);
        const balance = this.parseAmount(row.__EMPTY_8);

        // Debug log for first few rows
        if (i < dataStartIndex + 10) {
          // console.log(`Row ${i}: S.No=${sNoRaw}, Date=${transactionDate}, Remarks=${remarks}, Withdrawal=${withdrawalAmount}, Deposit=${depositAmount}, Balance=${balance}`);
        }

        // Skip completely empty rows
        if (!sNoRaw && !valueDate && !transactionDate && !chequeNumber && !remarks && !withdrawalAmount && !depositAmount && !balance) {
          continue;
        }

        // Check if this is a main transaction row (has S.No and (withdrawal OR deposit amount))
        const isMainTransaction = sNoRaw && (withdrawalAmount > 0 || depositAmount > 0);

        // Check if this is a continuation row (no S.No, no amounts, but has remarks)
        const isContinuationRow = !sNoRaw && !withdrawalAmount && !depositAmount && remarks && transactions.length > 0;

        // If this is a continuation row, append remarks to the previous transaction
        if (isContinuationRow) {
          transactions[transactions.length - 1].transactionRemarks += ' ' + remarks;
          continue;
        }

        // If this is a main transaction, add it
        if (isMainTransaction) {
          const transaction = {
            sNo: parseInt(sNoRaw) || serialNumber,
            valueDate: valueDate,
            transactionDate: transactionDate,
            chequeNumber: chequeNumber,
            transactionRemarks: remarks,
            withdrawalAmount: withdrawalAmount,
            depositAmount: depositAmount,
            balance: balance,
            year: year
          };
          serialNumber++;
          transactions.push(transaction);
        }
      }

      console.log(`Loaded ${transactions.length} transactions from ${fileName}`);
      return transactions;
    } catch (error) {
      console.error(`Error reading transactions for year ${year}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to parse amount strings
   */
  private parseAmount(value: any): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    
    // Remove commas and convert to number
    const cleaned = String(value).replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
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
