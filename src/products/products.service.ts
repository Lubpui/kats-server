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
import { ProductCatagoryRequest } from './requests/product-catagory.request'
import { Product, ProductDocument } from './schemas/product.schema'
import {
  ProductListResponse,
  ProductResponse,
} from './responses/product.response'
import { ProductRequest } from './requests/product.request'
import { TypeProductRequest } from './requests/product-typeproduct.request'
import { TypeProductResponse } from './responses/product-typeproduct.response'
import {
  TypeProduct,
  TypeProductDocument,
} from './schemas/product-typeproduct.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(TypeProduct.name)
    private readonly productTypeModel: Model<TypeProductDocument>,
    @InjectModel(ProductCatagory.name)
    private readonly productCatagoryModel: Model<ProductCatagoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(
    createProductResquest: ProductRequest,
  ): Promise<ProductResponse> {
    try {
      const { catagoryId } = createProductResquest

      const newProduct = {
        ...createProductResquest,
        catagoryId: new Types.ObjectId(catagoryId),
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

  async createCatagory(
    createCatagoryResquest: ProductCatagoryRequest,
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

  async createTypeProduct(
    createTypeProductResquest: TypeProductRequest,
  ): Promise<TypeProductResponse> {
    try {
      const createdTypeProduct = await new this.productTypeModel(
        createTypeProductResquest,
      ).save()

      return modelMapper(TypeProductResponse, createdTypeProduct)
    } catch (error) {
      throw error
    }
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productModel
      .find()
      .populate('catagory')
      .populate('typeProduct')
    return modelMapper(ProductListResponse, { data: products }).data
  }

  async getAllCatagories(): Promise<ProductCatagoryResponse[]> {
    const catagories = await this.productCatagoryModel.find()
    return modelMapper(ProductCatagoryListResponse, { data: catagories }).data
  }

  async getAllTypeProduct(): Promise<TypeProductResponse[]> {
    const productTypes = await this.productTypeModel.find()
    return modelMapper(ProductCatagoryListResponse, { data: productTypes }).data
  }

  async getProductById(productId: string): Promise<ProductResponse> {
    const Product = await this.productModel
      .findById(productId)
      .populate('catagory')
    return modelMapper(ProductResponse, Product)
  }

  async getCatagoryById(catagoryId: string): Promise<ProductCatagoryResponse> {
    const catagorie = await this.productCatagoryModel.findById(catagoryId)
    return modelMapper(ProductCatagoryResponse, catagorie)
  }

  async updateProductById(
    productId: string,
    updateProductRequest: ProductRequest,
  ) {
    const Expenses = await this.productModel.findByIdAndUpdate(productId, {
      $set: { ...updateProductRequest },
    })
    return Expenses
  }

  async updateCatagoryById(
    catagoryId: string,
    updateCatagoryRequest: ProductCatagoryRequest,
  ) {
    const catagorie = await this.productCatagoryModel.findByIdAndUpdate(
      catagoryId,
      {
        $set: { ...updateCatagoryRequest },
      },
    )
    return catagorie
  }

  async updateTypeProductById(
    typeProductId: string,
    updateTypeProductRequest: TypeProductRequest,
  ) {
    const typeProduct = await this.productTypeModel.findByIdAndUpdate(
      typeProductId,
      {
        $set: { ...updateTypeProductRequest },
      },
    )
    return typeProduct
  }

  async isDeleteProductById(
    productId: string,
    updateStatusDeleteRequest: ProductRequest,
  ) {
    const updateStatus = await this.updateProductById(
      productId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async isDeleteCatagoryById(
    catagoryId: string,
    updateStatusDeleteRequest: ProductCatagoryRequest,
  ) {
    const updateStatus = await this.updateCatagoryById(
      catagoryId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async isDeleteTypeProductById(
    typeProductId: string,
    updateStatusDeleteRequest: TypeProductRequest,
  ) {
    const updateStatus = await this.updateTypeProductById(
      typeProductId,
      updateStatusDeleteRequest,
    )

    return updateStatus
  }

  async deleteProductById(productId: string) {
    const product = await this.productModel.findByIdAndDelete(productId)
    return product
  }

  async deleteCatagoryById(catagoryId: string) {
    const catagory =
      await this.productCatagoryModel.findByIdAndDelete(catagoryId)
    return catagory
  }

  async deleteTypeProductById(typeProductId: string) {
    const typeProduct =
      await this.productTypeModel.findByIdAndDelete(typeProductId)
    return typeProduct
  }
}
