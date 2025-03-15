import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductsService {
  createProduct(createProductResquest: any) {
    return createProductResquest
  }

  findAll() {
    return `This action returns all products`
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, updateProductDto: any) {
    return updateProductDto
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
