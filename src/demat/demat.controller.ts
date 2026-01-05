// src/demat/demat.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DematService } from './demat.service';

@Controller('demat')
export class DematController {
  constructor(private readonly dematService: DematService) {}

  @Get()
  getData() {
    return this.dematService.getDataFromJson();
  }

  @Get('table-view')
  getTableView(@Res() res: Response) {
    const data = this.dematService.getDataFromJson();
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demat Portfolio</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 1.1em;
            opacity: 0.9;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead {
            background: #f8f9fa;
          }
          th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #dee2e6;
          }
          td {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
            color: #495057;
          }
          tbody tr {
            transition: background-color 0.2s;
          }
          tbody tr:hover {
            background-color: #f1f3f5;
          }
          .price {
            color: #28a745;
            font-weight: 600;
          }
          .qty {
            color: #007bff;
            font-weight: 600;
          }
          .total {
            color: #dc3545;
            font-weight: 700;
            font-size: 1.1em;
          }
          .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 0.9em;
          }
          @media (max-width: 768px) {
            .header h1 {
              font-size: 1.8em;
            }
            th, td {
              padding: 10px;
              font-size: 0.9em;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Demat Portfolio</h1>
            <p>Your Stock Holdings Overview</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>SID</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td><strong>${item.sid}</strong></td>
                  <td>${item.name}</td>
                  <td class="price">₹${item.price.toLocaleString()}</td>
                  <td class="qty">${item.qty}</td>
                  <td class="total">₹${item.total.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Last Updated: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
