// role.enum.ts
export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  role  Role   @default(STAFF)
}

enum Role {
  ADMIN
  STAFF
}

// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // from JWT

    return requiredRoles.includes(user.role);
  }
}

// jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}


// employee.controller.ts
import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('employee')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {

  // ✅ Only ADMIN can create
  @Post()
  @Roles(Role.ADMIN)
  createEmployee(@Body() data) {
    return "Employee Created";
  }

  // ✅ ADMIN + STAFF can edit
  @Patch()
  @Roles(Role.ADMIN, Role.STAFF)
  updateEmployee(@Body() data) {
    return "Employee Updated";
  }
}

{
  userId: 1,
  role: 'ADMIN'
}

// employee.service.ts
@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  create(data) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}