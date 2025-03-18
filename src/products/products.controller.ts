import { Controller, Get, Post, Body } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductCatagoryResponse } from './responses/product-catagory.response'
import { ProductCatagoryRequest } from './requests/product-catagory.request'
import { ProductRequest } from './requests/product.request'
import { ProductResponse } from './responses/product.response'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(
    @Body() createProductRequest: ProductRequest,
  ): Promise<ProductResponse> {
    return this.productsService.createProduct(createProductRequest)
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
    @Body() createCatagoryResquest: ProductCatagoryRequest,
  ): Promise<ProductCatagoryResponse> {
    return this.productsService.createCatagory(createCatagoryResquest)
  }
}
