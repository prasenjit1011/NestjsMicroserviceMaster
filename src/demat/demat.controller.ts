// src/demat/demat.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DematService } from './demat.service';
import * as fs from 'fs';
import * as path from 'path';

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
        <td>${item.name || 'N/A'}</td>
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


  
}
