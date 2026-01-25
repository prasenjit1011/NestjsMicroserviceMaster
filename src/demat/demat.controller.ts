// src/demat/demat.controller.ts
import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { DematService } from './demat.service';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { getTemplatePath } from '../utils/path.util';

@Controller('demat')
export class DematController {
  constructor(private readonly dematService: DematService) {}

  @Get('/csvdata')
  async getData() {
    try {
      return await this.dematService.getDataFromCsv();
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  }

  @Get('/transaction')
  async getTransaction(@Res() res: Response) {
    return this.getTransactionByYear('2021', res);
  }

  @Get('/transaction/:year')
  async getTransactionByYear(@Param('year') year: string, @Res() res: Response) {
    try {
      // Validate year format (should be 4 digits)
      if (!/^\d{4}$/.test(year)) {
        return res.status(400).send('<h1>Invalid year format. Year must be 4 digits (e.g., 2021)</h1>');
      }

      // Get transaction data from Excel file
      const transactions = await this.dematService.getTransactionsByYear(year);

      if (!transactions || transactions.length === 0) {
        return res.send('<h1>No transactions found for year ' + year + '</h1>');
      }

      // Calculate statistics
      const totalWithdrawal = transactions.reduce((sum, t) => sum + (t.withdrawalAmount || 0), 0);
      const totalDeposit = transactions.reduce((sum, t) => sum + (t.depositAmount || 0), 0);
      const latestBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

      // Generate table rows
      const tableRows = transactions.map((t, idx) =>{
        console.log(`Generating row for transaction Dtd : `, t.valueDate, ' === ');
        return `
        <tr style="background-color: ${idx % 2 === 0 ? '#f0f8ff' : '#ffffff'}; border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; border-right: 1px solid #ddd; text-align: center; font-weight: 600;">${t.sNo}</td>
          <td style="padding: 10px; border-right: 1px solid #ddd; font-weight: 600; color: #0066cc;">${t.transactionDate}</td>
          <td style="padding: 10px; border-right: 1px solid #ddd;">${t.transactionRemarks}</td>
          <td style="padding: 10px; border-right: 1px solid #ddd; text-align: right; font-weight: 600; color: ${t.withdrawalAmount > 0 ? '#e74c3c' : '#999'};">₹${t.withdrawalAmount > 0 ? parseInt(t.withdrawalAmount) : '-'}</td>
          <td style="padding: 10px; border-right: 1px solid #ddd; text-align: right; font-weight: 600; color: ${t.depositAmount > 0 ? '#2ecc71' : '#999'};">₹${t.depositAmount > 0 ? parseInt(t.depositAmount) : '-'}</td>
          <td style="padding: 10px; text-align: right; font-weight: 600; color: #0066cc;">₹${parseInt(t.balance)}</td>
        </tr>
      `}).join('');

      // Read and render the template
      const templatePath = getTemplatePath('transaction.html');
      let html = fs.readFileSync(templatePath, 'utf8');

      // Replace placeholders (using global replace for multiple occurrences)
      html = html.replace(/{{YEAR}}/g, year);
      html = html.replace(/{{TRANSACTION_COUNT}}/g, transactions.length.toString());
      html = html.replace(/{{TOTAL_WITHDRAWAL}}/g, totalWithdrawal.toFixed(0));
      html = html.replace(/{{TOTAL_DEPOSIT}}/g, totalDeposit.toFixed(0));
      html = html.replace(/{{LATEST_BALANCE}}/g, latestBalance.toFixed(0));
      html = html.replace(/{{TABLE_ROWS}}/g, tableRows);
      html = html.replace(/{{TIMESTAMP}}/g, new Date().toLocaleString());

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Error in getTransactionByYear:', error);
      res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
  }

  @Get('/tradelist')
  async getTradeTableView(@Res() res: Response) {
    try {
    const sidData = this.dematService.getDataFromJson();
    const sidIds  = sidData.map(item => item.sid).join(',');
    const apiUrl = `https://quotes-api.tickertape.in/quotes?sids=${sidIds}`;

    const templatePath = getTemplatePath('tradelist.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    let apiData: any = {};
    try {
      const response = await fetch(apiUrl);
      apiData = await response.json();
      // console.log('API Response:', apiData);
    } catch (error) {
      console.error('Error fetching from API:', error);
    }
    
    let sellValue = 0;
    let buyValue  = 0;

    const missingSidsSet = new Set();  // Use Set to track unique missing SIDs
    const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
    
    // Fetch all trade data from all years
    const yearlyTradeData = await Promise.all(
      years.map(year => this.dematService.getTradeDataFromCsv(year))
    );
    
    // Flatten all trades into a single array
    const allTrades = yearlyTradeData.flat().sort((a, b) => {
      return new Date(b.dtd).getTime() - new Date(a.dtd).getTime();
    });

    console.log(`Total trades across all years: ${allTrades.length}`);
    console.log('Breakdown by year:', yearlyTradeData.map((trades, i) => 
      `${years[i]}: ${trades.length} trades`
    ).join(', '));

    // Create lookup maps for O(1) access
    const sidDataMap = new Map(sidData.map(item => [item.iciciCode, item.sid]));
    const apiDataMap = new Map(apiData.data?.map(item => [item.sid, item]) || []);

    const dataRows = allTrades.map((item, index) => {
      // Calculate buy/sell values
      let colorCode = this.stringToColor(item.sid);
      const tradeValue = item.price * item.qty;
      if (item.action === 'Buy') {
        buyValue += tradeValue;
      } else {
        sellValue += tradeValue;
      }

      // Use Map for O(1) lookup
      const sid = sidDataMap.get(item.sid) || 'N/A';
      const itemData = apiDataMap.get(sid);
      const apiPrice = itemData && (itemData as any).price ? (itemData as any).price.toFixed(0) : '0';
      const sidCode = itemData && (itemData as any).sid ? (itemData as any).sid : 'NA';

      if(!apiPrice || apiPrice === '0'){
        missingSidsSet.add(item.sid);  // Add unique SID to Set
      }

      return `
        <tr style="background-color: ${colorCode}">
          <td class="total">${index + 1}</td>
          <td>${item.sid || 'N/A'}</td>
          <td>${sidCode || 'N/A'}</td>
          <td><a href="/demat/quarterly/${sid}/${item.sid || 'N/A'}" >${item.sid || 'N/A'}</a></td>
          <td>${item.action || 'N/A'}</td>
          <td class="qty">${item.qty || 0}</td>
          <td class="total">₹${item.price?.toFixed(0) || '0'}</td>
          <td class="total">₹${apiPrice}</td>
          <td class="total">₹${item.tradevalue?.toFixed(0) || '0'}</td>
          <td>${item.dtd || 'N/A'}</td>
        </tr>
      `;
    }).join('');
    
    // Log missing SIDs (stocks without API price data)
    if(missingSidsSet.size > 0) {
      const missingSidsArray = Array.from(missingSidsSet).map(sid => ({iciciCode: sid, sid: sid}));
      console.log(`\n⚠️  Missing API data for ${missingSidsSet.size} unique stocks:`);
      console.log(JSON.stringify(missingSidsArray, null, 2));
      console.log('Length : '+missingSidsArray.length);
    }
    
    // Replace placeholders
    html = html.replace('{{dataRows}}', dataRows);
    html = html.replace('{{TIMESTAMP}}', new Date().toLocaleString());

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error in getTradeTableView:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
  }

  @Get('/daystatus/:investmentValue/:currentValue')
  async getDayStatus(@Param('investmentValue') investmentValue: number, @Param('currentValue') currentValue: number, @Res() res: Response) {
    try {
      const yearlyHighLowData = this.dematService.yearlyHighLowData();
      console.log(yearlyHighLowData);
      res.status(200).json(yearlyHighLowData);
    } catch (error) {
      console.error('Error in getDayStatus:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  @Get('/')
  async getTableView(@Res() res: Response) {
    try {
    const yearlyHighLowData = this.dematService.yearlyHighLowData();
    const data    = await this.dematService.getDataFromCsv();
    const sidData = this.dematService.getDataFromJson();
    const sidIds  = sidData.map(item => item.sid).join(',');
    const apiUrl  = `https://quotes-api.tickertape.in/quotes?sids=${sidIds}`;
    const years   = (new Date).getFullYear();
    
    let apiData: any = {};
    try {
      const response = await fetch(apiUrl);
      apiData = await response.json();
      // console.log('API Response:', apiData);
    } catch (error) {
      console.error('Error fetching from API:', error);
    }

    // Read the HTML template
    const templatePath = getTemplatePath('home.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    let buyAmount = 0;
    let currentPrice = 0;
    let daysProfit = 0;

    // Generate table rows
    const tableRows = data.map((item, key) => {
      const sidItem = sidData.find(sid => sid.iciciCode === item.sid);
      const sid     = sidItem ? sidItem.sid : 'N/A';
      const apiDataItem = apiData.data && apiData.data.find(data => data.sid === sid);
      const apiPrice = apiDataItem ? apiDataItem.price.toFixed(0) : 0;
      const dyChange = apiDataItem ? apiDataItem.dyChange.toFixed(0) : 0;
      const wkChange = apiDataItem ? apiDataItem.wkChange.toFixed(0) : 0;
      const mnChange = apiDataItem ? apiDataItem.mnChange.toFixed(0) : 0;
      const change   = apiDataItem ? parseFloat((apiDataItem.change * item.qty).toFixed(0)) : 0;
      const profit = apiDataItem ? (apiPrice * item.qty - item.total).toFixed(0) : 0;
      let highestValue = 0;
      let lowestValue = 0;
      let yearlyHigh = [0, 0, 0, 0, 0, 0, 0, 0];

      if(item.qty === 0){
        // Handle zero quantity case
        // console.log('"', item.sid, '", ');
        // return ``;
      }


      if (yearlyHighLowData[sid]) {
        highestValue  = Math.round(Math.max(...Object.values(yearlyHighLowData[sid]).map((v: any) => v.high)));
        lowestValue   = Math.round(Math.min(...Object.values(yearlyHighLowData[sid]).map((v: any) => v.low)));

        yearlyHigh[0]   = yearlyHighLowData[sid][years] ? yearlyHighLowData[sid][years].high : null;
        yearlyHigh[1]   = yearlyHighLowData[sid][years-1] ? yearlyHighLowData[sid][years-1].high : null;
        yearlyHigh[2]   = yearlyHighLowData[sid][years-2] ? yearlyHighLowData[sid][years-2].high : null;
        yearlyHigh[3]   = yearlyHighLowData[sid][years-3] ? yearlyHighLowData[sid][years-3].high : null;
        yearlyHigh[4]   = yearlyHighLowData[sid][years-4] ? yearlyHighLowData[sid][years-4].high : null;
        yearlyHigh[5]   = yearlyHighLowData[sid][years-5] ? yearlyHighLowData[sid][years-5].high : null;
        yearlyHigh[6]   = yearlyHighLowData[sid][2020] ? yearlyHighLowData[sid][2020].low : null;
        yearlyHigh[7]   = yearlyHighLowData[sid][years-8] ? yearlyHighLowData[sid][years-8].high : null;
        yearlyHigh[8]   = yearlyHighLowData[sid][years-11] ? yearlyHighLowData[sid][years-11].high : null;
      }
      

      let overPrice = 0;
      if(yearlyHigh[6]) {
        overPrice = apiPrice / yearlyHigh[6];
        // overPrice = ((overPrice - 1) * 100);
      }

      buyAmount += item.price * item.qty;
      currentPrice += apiPrice * item.qty;
      daysProfit += change;

      return `
      <tr>
        <td class="total">${key+1}</td>
        <td>
          <a href="/demat/tradelist?sidCode=${sid}" >
            ${item.sid || 'N/A'}
          </a>
        </td>
        <td>
          <a href="http://localhost:4200/details/${sid}" >
            ${sid || 'N/A'}
          </a>
        </td>
        <td>
          <a href="/demat/quarterly/${sid}/${item.name || 'N/A'}" >tickertape ${item.name || 'N/A'}</a>
        </td>
        <td class="total">${dyChange}%</td>
        <td class="price">₹${(item.price || 0).toFixed(0)}</td>
        <td class="total">₹${apiPrice}</td>
        <td class="qty">${item.qty || 0}</td>
        <td class="total">₹${(item.total || 0).toFixed(0)}</td>
        <td class="total">₹${profit || 0}</td>
        <td class="price">${overPrice.toFixed(2) || 0}</td>
        <td class="price">₹${(yearlyHigh[6] || 0).toFixed(0)}</td>

        <td class="total">₹${(yearlyHigh[0] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[1] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[2] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[3] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[4] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[5] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[7] || 0).toFixed(0)}</td>
        <td class="total">₹${(yearlyHigh[8] || 0).toFixed(0)}</td>

        
        <td class="total">₹${highestValue || 0}</td>
        <td class="total">₹${lowestValue || 0}</td>
        <td class="total">${wkChange}%</td>
        <td class="total">${mnChange}%</td>
        <th class="total">${change}</th>
      </tr>
    `}).join('');
    
    console.log('==>', buyAmount, currentPrice)
    const overallProfit = currentPrice - buyAmount;


    // Store profit/loss data with timestamp (Business hours only: Mon-Fri, 9:15 AM - 3:59 PM)
    try {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hours * 60 + minutes; // Convert to minutes for easier comparison
      
      // Check if within business hours: Monday (1) to Friday (5), 9:15 AM to 3:59 PM
      const isMonday = dayOfWeek === 1;
      const isFriday = dayOfWeek === 5;
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      const isBusinessHours = timeInMinutes >= 555 && timeInMinutes < 1439; // 9:15 AM (555 min) to 3:59 PM (1439 min)
      
      if (isWeekday && isBusinessHours) {
        const profitDataPath = path.join(process.cwd(), 'public', 'data', 'profit.json');
        let profitHistory = [];
        
        // Read existing data if file has content
        if (fs.existsSync(profitDataPath)) {
          const fileContent = fs.readFileSync(profitDataPath, 'utf8');
          if (fileContent.trim()) {
            profitHistory = JSON.parse(fileContent);
          }
        }
        
        // Calculate current profit/loss percent
        const currentProfitLossPercent = buyAmount > 0 ? parseFloat(((overallProfit / buyAmount) * 100).toFixed(2)) : 0;
        
        // Check if we should save this entry
        let shouldSave = false;
        let lastHourEntry = null;
        
        if (profitHistory.length === 0) {
          // First entry, always save
          shouldSave = true;
        } else {
          // Check if last entry is from same hour
          const lastEntry = profitHistory[profitHistory.length - 1];
          const lastEntryTime = new Date(lastEntry.date);
          const lastEntryHour = lastEntryTime.getHours();
          const currentHour = now.getHours();
          
          // Only save if it's a different hour
          if (currentHour !== lastEntryHour) {
            // Check if profit/loss percent has changed by at least 1%
            const lastProfitPercent = parseFloat(lastEntry.profitLossPercent);
            const percentDifference = Math.abs(currentProfitLossPercent - lastProfitPercent);
            
            if (percentDifference >= 1) {
              shouldSave = true;
            }
          }
        }
        
        if (shouldSave) {
          // Add new profit/loss entry with timestamp
          const timestamp = now.toISOString();
          const profitPadded = parseInt(String(Math.round(overallProfit)).padStart(6, '0'));
          const profitEntry = {
            date: timestamp,
            curAmount: parseInt(currentPrice.toFixed(0)),
            buyAmount: parseInt(buyAmount.toFixed(0)),
            currProfit: profitPadded,
            dayProfit: parseInt(daysProfit.toFixed(0)),
            curPercent: parseFloat(currentProfitLossPercent.toFixed(2))
          };
          
          profitHistory.push(profitEntry);
          
          // Keep only last 100 entries to avoid file getting too large
          if (profitHistory.length > 100) {
            profitHistory = profitHistory.slice(-100);
          }
          
          // Write updated data
          fs.writeFileSync(profitDataPath, JSON.stringify(profitHistory, null, 2), 'utf8');
          console.log('Profit/Loss data saved:', profitEntry);
        } else {
          console.log('Skipped saving: Same hour or insufficient profit/loss change (<1%)');
        }
      } else {
        console.log('Outside business hours: Mon-Fri 9:15 AM - 3:59 PM. Data not saved.');
      }
    } catch (error) {
      console.error('Error saving profit/loss data:', error);
    }

    // Replace placeholders
    html = html.replace('{{TABLE_ROWS}}', tableRows);
    html = html.replace('{{TIMESTAMP}}', new Date().toLocaleString());
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    } catch (error) {
      console.error('Error in getTableView:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  @Get('/fetch-stock-data')
  async fetchStockData(@Res() res: Response) {
    try {
      const data    = await this.dematService.getDataFromCsv();
      const sidData = this.dematService.getDataFromJson();


    // --- Build and store yearly high/low per SID into public/data/sid_yearly_highlow.json ---
    // Helper: fetch historical data for a SID and compute yearly high/low
    const fetchYearlyHighLow = (sid: string) => {
      return new Promise<Record<string, { low: number; high: number }>>((resolve) => {
        const apiUrl = `https://api.tickertape.in/stocks/charts/inter/${sid}?duration=max`;
        try {
          https.get(apiUrl, (apiRes) => {
            let body = '';
            apiRes.on('data', (chunk) => body += chunk);
            apiRes.on('end', () => {
              try {
                const mydata = JSON.parse(body);
                const points = mydata['data'] && mydata['data'][0] ? mydata['data'][0]['points'] : [];
                const yearly: Record<string, { low: number; high: number }> = {};
                points.forEach(point => {
                  const year = new Date(point['ts']).getFullYear();
                  if (!yearly[year]) yearly[year] = { low: Infinity, high: -Infinity };
                  yearly[year].high = Math.max(yearly[year].high, point['lp']);
                  yearly[year].low = Math.min(yearly[year].low, point['lp']);
                });
                resolve(yearly);
              } catch (err) {
                console.error(`Error parsing historical data for ${sid}:`, err);
                resolve({});
              }
            });
          }).on('error', (err) => {
            console.error(`HTTP error for ${sid}:`, err);
            resolve({});
          });
        } catch (err) {
          console.error(`Request error for ${sid}:`, err);
          resolve({});
        }
      });
    };

    // Collect unique SIDs from holdings (mapped via sidData)
    const uniqueSids = Array.from(new Set(data.map(item => {
      const sidItem = sidData.find(s => s.iciciCode === item.sid);
      return sidItem ? sidItem.sid : null;
    }).filter(Boolean)));

    const outDir = path.join(__dirname, '../../public/data');
    try {
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    } catch (err) {
      console.error('Error creating data directory:', err);
    }

    const outFile = path.join(outDir, 'sid_yearly_highlow.json');
    const result: Record<string, Record<string, { low: number; high: number }>> = {};

    // Limit to first 500 SIDs to avoid long-running requests; remove or increase as needed
    const limit = 500;
    for (let i = 0; i < Math.min(uniqueSids.length, limit); i++) {
      const s = uniqueSids[i];
      try {
        // Sequential fetch to be polite to API
        // eslint-disable-next-line no-await-in-loop
        const yearly = await fetchYearlyHighLow(s);
        result[s] = yearly;
      } catch (err) {
        console.error(`Failed to fetch yearly data for ${s}:`, err);
        result[s] = {};
      }
    }

    try {
      fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
      console.log(`Wrote yearly high/low data for ${Object.keys(result).length} SIDs to ${outFile}`);
    } catch (err) {
      console.error('Error writing yearly high/low JSON file:', err);
    }

      res.json({ message: 'Yearly high/low data fetch initiated', sidsFetched: Object.keys(result).length });
    } catch (error) {
      console.error('Error in fetchStockData:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  @Get('weekly/:sid')
  async getAnalysis(@Param('sid') sid: string, @Res() res: Response) {
    return this.getAnalysisWithStock(sid, 'N/A', res);
  }

  @Get('weekly/:sid/:stock')
  async getAnalysisWithStockParam(@Param('sid') sid: string, @Param('stock') stock: string, @Res() res: Response) {
    return this.getAnalysisWithStock(sid, stock, res);
  }



  private async getAnalysisWithStock(sid: string, stock: string, res: Response) {
    if(!stock || stock === ''){
      stock = 'N/A';
    }

    const apiUrl = `https://api.tickertape.in/stocks/charts/inter/${sid}?duration=max`;

    https.get(apiUrl, (apiRes) => {
      let data = '';
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        const mydata = JSON.parse(data);
        // Get the latest price (last data point)
        const points = mydata['data'] && mydata['data'][0] ? mydata['data'][0]['points'] : [];
        const latestPoint = points.length > 0 ? points[points.length - 1] : null;
        const latestPrice = latestPoint ? latestPoint['lp'] : 0;
        const latestDate = latestPoint ? new Date(latestPoint['ts']).toLocaleString() : 'N/A';

        // Read HTML template
        const templatePath = getTemplatePath('quarterly-high-low.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Prepare data
        const dataSeriesCount = mydata['data'] ? mydata['data'].length : 0;
        const totalPoints = mydata['data'] && mydata['data'][0] ? mydata['data'][0]['points'].length : 0;
        const dataName = mydata['data'] && mydata['data'][0] ? (mydata['data'][0]['name'] || 'N/A') : 'N/A';
        const dataType = mydata['data'] && mydata['data'][0] ? (mydata['data'][0]['type'] || 'N/A') : 'N/A';
        const dataPointsCount = totalPoints;
        
        // Generate table rows
        const dataRows = mydata['data'] && mydata['data'][0] 
          ? mydata['data'][0]['points']
              .reverse()
              .map((point, index) => {
                const timestamp = point['ts'] ? new Date(point['ts']).toLocaleString() : 'N/A';
                const value = point['lp'] !== null && point['lp'] !== undefined ? point['lp'].toFixed(2) : 'N/A';

                return `
                <tr>
                    <td>${index + 1}</td>
                    <td class="timestamp">${timestamp}</td>
                    <td class="value">${value}</td>
                </tr>
                `;
              }).join('')
          : '<tr><td colspan="3">No data available</td></tr>';

        const jsonData = JSON.stringify(mydata, null, 2);

        // Replace placeholders with actual data
        html = html.replaceAll('{{stockName}}', stock);
        html = html.replaceAll('{{sid}}', sid);
        html = html.replace('{{dataSeriesCount}}', dataSeriesCount);
        html = html.replace('{{totalPoints}}', totalPoints);
        html = html.replace('{{dataName}}', dataName);
        html = html.replace('{{dataType}}', dataType);
        html = html.replace('{{dataPointsCount}}', dataPointsCount);
        html = html.replace('{{latestPrice}}', `₹${latestPrice.toFixed(2)}`);
        html = html.replace('{{latestDate}}', latestDate);
        html = html.replace('{{dataRows}}', dataRows);
        html = html.replace('{{jsonData}}', jsonData);

        res.send(html);
      });
    }).on('error', (err) => {
      console.error('Error fetching data from API:', err);
      res.status(500).send('Error fetching data from Tickertape API');
    });
  }

  @Get('yearly/:sid')
  async getYearlyPrice(@Param('sid') sid: string, @Res() res: Response) {
    return this.getYearlyPriceWithStock(sid, 'N/A', res);
  }

  @Get('yearly/:sid/:stock')
  async getYearlyPriceWithStockParam(@Param('sid') sid: string, @Param('stock') stock: string, @Res() res: Response) {
    return this.getYearlyPriceWithStock(sid, stock, res);
  }

  private async getYearlyPriceWithStock(sid: string, stock: string, res: Response) {
    const apiUrl = `https://api.tickertape.in/stocks/charts/inter/${sid}?duration=max`;
    if(!stock || stock === ''){
      stock = 'N/A';
    }

    https.get(apiUrl, (apiRes) => {
      let data = '';
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        const mydata = JSON.parse(data);
        console.log('\n\n-: JSON Data Loaded from API :-\n\n');

        // Get the latest price (last data point)
        const points = mydata['data'] && mydata['data'][0] ? mydata['data'][0]['points'] : [];
        const latestPoint = points.length > 0 ? points[points.length - 1] : null;
        const latestPrice = latestPoint ? latestPoint['lp'] : 0;
        const latestDate = latestPoint ? new Date(latestPoint['ts']).toLocaleString() : 'N/A';

        // Get high and low prices by year
        let yearlyData = {};
        mydata['data'] && mydata['data'][0] && mydata['data'][0]['points'].forEach(point => {
          const year = new Date(point['ts']).getFullYear();

          if(!yearlyData[year]){
            yearlyData[year] = { low: Infinity, high: -Infinity };
          }
          yearlyData[year].high = Math.max(yearlyData[year].high, point['lp']);
          yearlyData[year].low = Math.min(yearlyData[year].low, point['lp']);
        });

        // Read HTML template
        const templatePath = getTemplatePath('yearly-high-low.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Generate table rows
        const tableRows = Object.keys(yearlyData).sort((a, b) => Number(b) - Number(a)).map(year => {
          const data = yearlyData[year];
          const range = (data.high - data.low).toFixed(2);
          const percentageChange = ((data.high - data.low) / data.low * 100).toFixed(2);
          
          return `
              <tr>
                  <td style="font-weight: 600; color: #667eea; font-size: 1.1em;">${year}</td>
                  <td class="low-price">₹${data.low.toFixed(2)}</td>
                  <td class="high-price">₹${data.high.toFixed(2)}</td>
                  <td class="range">₹${range}</td>
                  <td style="font-weight: 600; color: #ff9800;">${percentageChange}%</td>
              </tr>
          `;
        }).join('');

        // Replace placeholders (use replaceAll for multiple occurrences)
        html = html.replaceAll('{{stockName}}', stock);
        html = html.replaceAll('{{sid}}', sid);
        html = html.replace('{{status}}', 'Success ✓');
        html = html.replace('{{message}}', 'Yearly high/low data fetched successfully!');
        html = html.replace('{{latestPrice}}', `₹${latestPrice.toFixed(2)}`);
        html = html.replace('{{latestDate}}', latestDate);
        html = html.replace('{{tableRows}}', tableRows);

        res.send(html);
      });
    }).on('error', (err) => {
      console.error('Error fetching data from API:', err);
      res.status(500).send('Error fetching data from Tickertape API');
    });
  }

  @Get('quarterly/:sid')
  async getQuarterlyPrice(@Param('sid') sid: string, @Res() res: Response) {
    return this.getQuarterlyPriceWithStock(sid, 'N/A', res);
  }

  @Get('quarterly/:sid/:stock')
  async getQuarterlyPriceWithStockParam(@Param('sid') sid: string, @Param('stock') stock: string, @Res() res: Response) {
    return this.getQuarterlyPriceWithStock(sid, stock, res);
  }

  private async getQuarterlyPriceWithStock(sid: string, stock: string, res: Response) {
    const apiUrl = `https://api.tickertape.in/stocks/charts/inter/${sid}?duration=max`;
    if(!stock || stock === ''){
      stock = 'N/A';
    }

    https.get(apiUrl, (apiRes) => {
      let data = '';
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        const mydata = JSON.parse(data);
        console.log('\n\n-: JSON Data Loaded from API :-\n\n');

        // Get the latest price (last data point)
        const points = mydata['data'] && mydata['data'][0] ? mydata['data'][0]['points'] : [];
        const latestPoint = points.length > 0 ? points[points.length - 1] : null;
        const latestPrice = latestPoint ? latestPoint['lp'] : 0;
        const latestDate = latestPoint ? new Date(latestPoint['ts']).toLocaleString() : 'N/A';

        // Get high and low prices by quarter
        let quarterlyData = {};
        mydata['data'] && mydata['data'][0] && mydata['data'][0]['points'].forEach(point => {
          const date = new Date(point['ts']);
          const year = date.getFullYear();
          const month = date.getMonth(); // 0-11
          const quarter = Math.floor(month / 3) + 1; // 1-4
          const key = `${year}-Q${quarter}`;

          if(!quarterlyData[key]){
            quarterlyData[key] = { 
              low: Infinity, 
              high: -Infinity,
              year: year,
              quarter: quarter
            };
          }
          quarterlyData[key].high = Math.max(quarterlyData[key].high, point['lp']);
          quarterlyData[key].low = Math.min(quarterlyData[key].low, point['lp']);
        });

        // Read HTML template
        const templatePath = getTemplatePath('quarterly-high-low.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Organize data by year and quarter for matrix view
        let yearlyQuarters = {};
        Object.keys(quarterlyData).forEach(key => {
          const data = quarterlyData[key];
          const year = data.year;
          const quarter = data.quarter;
          
          if (!yearlyQuarters[year]) {
            yearlyQuarters[year] = {};
          }
          yearlyQuarters[year][`Q${quarter}`] = data;
        });

        // Generate matrix rows (Year | Q1 | Q2 | Q3 | Q4)
        const quarterlyMatrixRows = Object.keys(yearlyQuarters)
          .sort((a, b) => Number(b) - Number(a)) // Sort years descending
          .map(year => {
            const quarters = yearlyQuarters[year];
            
            // Generate cell for each quarter
            const generateQuarterCell = (quarterKey) => {
              if (quarters[quarterKey]) {
                const data = quarters[quarterKey];
                const range = (data.high - data.low).toFixed(2);
                return `
                  <div class="quarter-cell">
                    <span class="high-price">H: ₹${data.high.toFixed(2)}</span>
                    <span class="low-price">L: ₹${data.low.toFixed(2)}</span>
                    <span class="range">Range: ₹${range}</span>
                  </div>
                `;
              } else {
                return '<span style="color: #ccc;">-</span>';
              }
            };
            
            return `
              <tr>
                <td class="year-label">${year}</td>
                <td>${generateQuarterCell('Q1')}</td>
                <td>${generateQuarterCell('Q2')}</td>
                <td>${generateQuarterCell('Q3')}</td>
                <td>${generateQuarterCell('Q4')}</td>
              </tr>
            `;
          }).join('');

        // Replace placeholders (use replaceAll for multiple occurrences)
        html = html.replaceAll('{{stockName}}', stock);
        html = html.replaceAll('{{sid}}', sid);
        html = html.replace('{{status}}', 'Success ✓');
        html = html.replace('{{message}}', 'Quarterly high/low data fetched successfully!');
        html = html.replace('{{apiUrl}}', apiUrl);
        html = html.replace('{{latestPrice}}', `₹${latestPrice.toFixed(2)}`);
        html = html.replace('{{latestDate}}', latestDate);
        html = html.replace('{{quarterlyMatrixRows}}', quarterlyMatrixRows);

        res.send(html);
      });
    }).on('error', (err) => {
      console.error('Error fetching data from API:', err);
      res.status(500).send('Error fetching data from Tickertape API');
    });
  }

  private stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate light green shades
    // Keep red and blue low, vary green for different shades of light green
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
    const lightness = 70 + (Math.abs(hash) % 15); // 70-85% (light)
    
    // HSL to RGB conversion
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * (saturation / 100);
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (hue >= 0 && hue < 60) { r = c; g = x; b = 0; }
    else if (hue >= 60 && hue < 120) { r = x; g = c; b = 0; }
    else if (hue >= 120 && hue < 180) { r = 0; g = c; b = x; }
    else if (hue >= 180 && hue < 240) { r = 0; g = x; b = c; }
    else if (hue >= 240 && hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const toHex = (val: number) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return ('0' + hex).slice(-2);
    };
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
}
