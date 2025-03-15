import { Injectable } from '@nestjs/common'

@Injectable()
export class EmployeesService {
  create(createEmployeeDto: any) {
    return createEmployeeDto
  }

  findAll() {
    return `This action returns all employees`
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`
  }

  update(id: number, updateEmployeeDto: any) {
    return updateEmployeeDto
  }

  remove(id: number) {
    return `This action removes a #${id} employee`
  }
}
