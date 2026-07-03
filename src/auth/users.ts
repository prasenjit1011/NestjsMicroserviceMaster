// src/auth/users.ts

import { Role } from './role.enum';

export const users = [
  {
    username: 'admin',
    password: 'admin',
    role: Role.ADMIN,
  },
  {
    username: 'customer',
    password: 'customer',
    role: Role.CUSTOMER,
  },
];