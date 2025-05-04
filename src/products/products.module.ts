import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './schemas/product.schema'
import {
  ProductCatagory,
  ProductCatagorySchema,
} from './schemas/product-catagory.schema'
import {
  TypeProduct,
  TypeProductSchema,
} from './schemas/product-typeproduct.schema'

export const ProductsMongoose = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
  { name: ProductCatagory.name, schema: ProductCatagorySchema },
  { name: TypeProduct.name, schema: TypeProductSchema },
])

@Module({
  imports: [ProductsMongoose],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
