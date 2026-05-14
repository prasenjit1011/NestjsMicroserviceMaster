//  product/product.service.ts
import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  private filePath = path.join(
    process.cwd(),
    'public',
    'product.json',
  );

  getProducts() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]');
    }

    return JSON.parse(
      fs.readFileSync(this.filePath, 'utf8'),
    );
  }

  saveProducts(data) {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(data, null, 2),
    );
  }
}