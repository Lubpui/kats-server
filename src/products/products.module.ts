import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './schemas/product.schema'
import {
  ProductCatagory,
  ProductCatagorySchema,
} from './schemas/product-catagory.schema'

export const ProductsMongoose = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
  { name: ProductCatagory.name, schema: ProductCatagorySchema },
])

@Module({
  imports: [ProductsMongoose],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
