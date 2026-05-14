// admin/admin.service.ts

import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminService {
  private filePath = path.join(
    process.cwd(),
    'public',
    'user.json',
  );

  getUsers() {
    return JSON.parse(
      fs.readFileSync(this.filePath, 'utf8'),
    );
  }

  saveUsers(data) {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(data, null, 2),
    );
  }
}