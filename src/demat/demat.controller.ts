// src/demat/demat.controller.ts
import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { DematService } from './demat.service';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

@Controller('demat')
export class DematController {
  constructor(private readonly dematService: DematService) {}

  @Get('/csvdata')
  async getData() {
    return this.dematService.getDataFromCsv();
  }

  @Get('/')
  async getTableView(@Res() res: Response) {
    const data    = await this.dematService.getDataFromCsv();
    const sidData = this.dematService.getDataFromJson();
    const sidIds  = sidData.map(item => item.sid).join(',');
    console.log('SID IDs:', sidIds);

    // Fetch data from Tickertape API
    const apiUrl = `https://quotes-api.tickertape.in/quotes?sids=${sidIds}`;
    // console.log('API URL:', apiUrl);
    
    let apiData: any = {};
    try {
      const response = await fetch(apiUrl);
      apiData = await response.json();
      // console.log('API Response:', apiData);
    } catch (error) {
      console.error('Error fetching from API:', error);
    }

    // Read the HTML template
    const templatePath = path.join(__dirname, 'templates', 'table-view.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Generate table rows
    const tableRows = data.map(item => {
      // console.log('Processing item:', item.sid);
      // console.log('Processing item:', item);

      const sidItem = sidData.find(sid => sid.iciciCode === item.sid);
      const sid     = sidItem ? sidItem.sid : 'N/A';
      const itemData = apiData.data.find(data => data.sid === sid);
      const apiPrice = itemData ? itemData.price.toFixed(0) : 'N/A';
      // console.log(apiPrice);
      // console.log('=====================');

      return `
      <tr>
        <td>${item.sid || 'N/A'}</td>
        <td>${sid || 'N/A'}</td>
        <td>
          <a href="/demat/quarterly/price/${sid}/${item.name || 'N/A'}" target="_blank">${item.name || 'N/A'}</a>
        </td>
        <td class="price">₹${(item.price || 0).toFixed(0)}</td>
        <td class="total">₹${apiPrice}</td>
        <td class="qty">${item.qty || 0}</td>
        <td class="total">₹${(item.total || 0).toFixed(0)}</td>
      </tr>
    `}).join('');
    
    // Replace placeholders
    html = html.replace('{{TABLE_ROWS}}', tableRows);
    html = html.replace('{{TIMESTAMP}}', new Date().toLocaleString());
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
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
        const templatePath = path.join(__dirname, 'templates', 'analysis.html');
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
        html = html.replace('{{stockName}}', stock);
        html = html.replace('{{sid}}', sid);
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

  @Get('yearly/price/:sid')
  async getYearlyPrice(@Param('sid') sid: string, @Res() res: Response) {
    return this.getYearlyPriceWithStock(sid, 'N/A', res);
  }

  @Get('yearly/price/:sid/:stock')
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
        const templatePath = path.join(__dirname, 'templates', 'yearly-high-low.html');
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

        // Replace placeholders
        html = html.replace('{{stockName}}', stock);
        html = html.replace('{{sid}}', sid);
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

  @Get('quarterly/price/:sid')
  async getQuarterlyPrice(@Param('sid') sid: string, @Res() res: Response) {
    return this.getQuarterlyPriceWithStock(sid, 'N/A', res);
  }

  @Get('quarterly/price/:sid/:stock')
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
        const templatePath = path.join(__dirname, 'templates', 'quarterly-high-low.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Generate table rows
        const tableRows = Object.keys(quarterlyData).sort((a, b) => {
          // Sort by year descending, then by quarter descending
          const [yearA, qA] = a.split('-Q');
          const [yearB, qB] = b.split('-Q');
          if (yearB !== yearA) return Number(yearB) - Number(yearA);
          return Number(qB) - Number(qA);
        }).map(key => {
          const data = quarterlyData[key];
          const range = (data.high - data.low).toFixed(2);
          const percentageChange = ((data.high - data.low) / data.low * 100).toFixed(2);
          
          return `
              <tr>
                  <td style="font-weight: 600; color: #667eea; font-size: 1.1em;">${key}</td>
                  <td class="low-price">₹${data.low.toFixed(2)}</td>
                  <td class="high-price">₹${data.high.toFixed(2)}</td>
                  <td class="range">₹${range}</td>
                  <td style="font-weight: 600; color: #ff9800;">${percentageChange}%</td>
              </tr>
          `;
        }).join('');

        // Replace placeholders
        html = html.replace('{{stockName}}', stock);
        html = html.replace('{{sid}}', sid);
        html = html.replace('{{status}}', 'Success ✓');
        html = html.replace('{{message}}', 'Quarterly high/low data fetched successfully!');
        html = html.replace('{{apiUrl}}', apiUrl);
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





}
