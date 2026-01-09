// src/company/company.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.schema';
import { CreateCompanyDto } from './company-create.dto';
import { UpdateCompanyDto } from './company-update.dto';

@Injectable()
export class CompanyRepository {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const createdCompany = new this.companyModel(createCompanyDto);
    return createdCompany.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string): Promise<Company> {
    return this.companyModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Company> {
    return this.companyModel.findOne({ name }).exec();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Company> {
    return this.companyModel.findByIdAndDelete(id).exec();
  }
}
