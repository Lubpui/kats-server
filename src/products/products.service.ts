import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductsService {
  createProduct(createProductResquest: any) {
    return createProductResquest
  }

  getAllCatagories() {
    return `This action returns all products`
  }
}
