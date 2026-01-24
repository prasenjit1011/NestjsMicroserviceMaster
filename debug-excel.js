const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, 'public/transaction/OpTransactionHistory-2024.xls');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

// Log first 20 rows to see structure
console.log('\n=== RAW DATA STRUCTURE ===\n');
for (let i = 0; i < Math.min(50, rawData.length); i++) {
  const row = rawData[i];
  console.log(`\nRow ${i}:`);
  console.log(JSON.stringify(row, null, 2));
}
