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
import { CUSTOM_CONNECTION_NAME } from 'src/utils/constanrs'
import { ConfigModule } from '@nestjs/config'

export const ProductsMongoose = MongooseModule.forFeature(
  [
    { name: TypeProduct.name, schema: TypeProductSchema },
    { name: ProductCatagory.name, schema: ProductCatagorySchema },
    { name: Product.name, schema: ProductSchema },
  ],
  
  CUSTOM_CONNECTION_NAME,
)

@Module({
  imports: [ProductsMongoose, ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
