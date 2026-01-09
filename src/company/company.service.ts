// src/company/company.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './company-create.dto';
import { UpdateCompanyDto } from './company-update.dto';
import { Company } from './company.schema';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.companyRepository.create(createCompanyDto);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => 
          err.message.replace('Path ', '').replace('`', '').replace('`', '')
        );
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages
        });
      }
      throw error;
    }
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findByName(name: string): Promise<Company> {
    const company = await this.companyRepository.findByName(name);
    if (!company) {
      throw new NotFoundException(`Company with name ${name} not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      const company = await this.companyRepository.update(id, updateCompanyDto);
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return company;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => 
          err.message.replace('Path ', '').replace('`', '').replace('`', '')
        );
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages
        });
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Company> {
    const company = await this.companyRepository.delete(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }
}
