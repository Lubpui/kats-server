import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
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

  @Post('catagory')
  createCatagory(
    @Body() createCatagoryResquest: ProductCatagoryRequest,
  ): Promise<ProductCatagoryResponse> {
    return this.productsService.createCatagory(createCatagoryResquest)
  }

  @Get()
  getAllProducts(): Promise<ProductResponse[]> {
    return this.productsService.getAllProducts()
  }

  @Get('catagories')
  getAllCatagories(): Promise<ProductCatagoryResponse[]> {
    return this.productsService.getAllCatagories()
  }

  @Get(':productId')
  getProductById(
    @Param('productId') productId: string,
  ): Promise<ProductRequest> {
    return this.productsService.getProductById(productId)
  }

  @Get('catagories/:catagoryId')
  getCatagoryById(
    @Param('catagoryId') catagoryId: string,
  ): Promise<ProductCatagoryResponse> {
    return this.productsService.getCatagoryById(catagoryId)
  }

  @Put('update/:productId')
  updateProductById(
    @Param('productId') productId: string,
    @Body() updateProductRequest: ProductRequest,
  ) {
    return this.productsService.updateProductById(
      productId,
      updateProductRequest,
    )
  }

  @Put('catagories/update/:catagoryId')
  updateCatagoryById(
    @Param('catagoryId') catagoryId: string,
    @Body() updateCatagoryRequest: ProductCatagoryRequest,
  ) {
    return this.productsService.updateCatagoryById(
      catagoryId,
      updateCatagoryRequest,
    )
  }

  @Post('selectDelete/:productId')
  isDeleteProductById(
    @Param('productId') productId: string,
    @Body() updateStatusDeleteRequest: ProductRequest,
  ) {
    return this.productsService.isDeleteProductById(
      productId,
      updateStatusDeleteRequest,
    )
  }

  @Post('catagories/selectDelete/:catagoryId')
  isDeleteCatagoryById(
    @Param('catagoryId') catagoryId: string,
    @Body() updateStatusDeleteRequest: ProductCatagoryRequest,
  ) {
    return this.productsService.isDeleteCatagoryById(
      catagoryId,
      updateStatusDeleteRequest,
    )
  }

  @Delete(':productId')
  deleteProductById(@Param('productId') productId: string) {
    return this.productsService.deleteProductById(productId)
  }

  @Delete(':catagoryId')
  deleteCatagoryById(@Param('catagoryId') catagoryId: string) {
    return this.productsService.deleteCatagoryById(catagoryId)
  }
}
