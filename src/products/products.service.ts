import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  ProductCatagory,
  ProductCatagoryDocument,
} from './schemas/product-catagory.schema'
import { Model, Types } from 'mongoose'
import { modelMapper } from 'src/utils/mapper.util'
import {
  ProductCatagoryListResponse,
  ProductCatagoryResponse,
} from './responses/product-catagory.response'
import { ProductCatagoryResquest } from './requests/product-catagory.request'
import { Product, ProductDocument } from './schemas/product.schema'
import {
  ProductListResponse,
  ProductResponse,
} from './responses/product.response'
import { ProductResquest } from './requests/product.request'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductCatagory.name)
    private readonly productCatagoryModel: Model<ProductCatagoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(
    createProductResquest: ProductResquest,
  ): Promise<ProductResponse> {
    try {
      const { catagory } = createProductResquest

      const newProduct = {
        ...createProductResquest,
        catagory: new Types.ObjectId(catagory._id),
      }

      const createdProduct = await new this.productModel(newProduct).save()

      const productsResponse = await this.productModel
        .findById(createdProduct._id)
        .populate('catagory')

      return modelMapper(ProductResponse, productsResponse)
    } catch (error) {
      throw error
    }
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productModel.find().populate('catagory')
    return modelMapper(ProductListResponse, { data: products }).data
  }

  async getAllCatagories(): Promise<ProductCatagoryResponse[]> {
    const catagories = await this.productCatagoryModel.find()
    return modelMapper(ProductCatagoryListResponse, { data: catagories }).data
  }

  async createCatagory(
    createCatagoryResquest: ProductCatagoryResquest,
  ): Promise<ProductCatagoryResponse> {
    try {
      const createdCatagory = await new this.productCatagoryModel(
        createCatagoryResquest,
      ).save()

      return modelMapper(ProductCatagoryResponse, createdCatagory)
    } catch (error) {
      throw error
    }
  }
}
