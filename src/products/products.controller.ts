import { Controller, Get, Post, Body } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductResquest: any) {
    return this.productsService.createProduct(createProductResquest)
  }

  @Get('catagories')
  getAllCatagories() {
    return this.productsService.getAllCatagories()
  }
}
