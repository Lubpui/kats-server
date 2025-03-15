import { Controller, Get, Post, Body } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductCatagoryResponse } from './responses/product-catagory.response'
import { ProductCatagoryResquest } from './requests/product-catagory.request'
import { ProductResquest } from './requests/product.request'
import { ProductResponse } from './responses/product.response'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(
    @Body() createProductResquest: ProductResquest,
  ): Promise<ProductResponse> {
    return this.productsService.createProduct(createProductResquest)
  }

  @Get()
  getAllProducts(): Promise<ProductResponse[]> {
    return this.productsService.getAllProducts()
  }

  @Get('catagories')
  getAllCatagories(): Promise<ProductCatagoryResponse[]> {
    return this.productsService.getAllCatagories()
  }

  @Post('catagory')
  createCatagory(
    @Body() createCatagoryResquest: ProductCatagoryResquest,
  ): Promise<ProductCatagoryResponse> {
    return this.productsService.createCatagory(createCatagoryResquest)
  }
}
