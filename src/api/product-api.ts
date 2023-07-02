import { IPagePagination } from '../types/api/order-api'
import {
  ICreateProduct,
  ICreateProductRes,
  IProductNameRes,
  IFilterProduct,
  IProductTable,
  ICreateProductItemRes,
  IDeleteProductItemRes,
  IProductSimPle,
  IProductUpdateReq,
  IProductUpdatedRes,
  IProdItemRes,
  IUpdateProdItem,
  IUpdateProdItemRes
} from '../types/api/product-api'
import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'product'
const URL = `${API}/${ENDPOINT}`

const productApi = {
  create: (body: ICreateProduct) => {
    return axiosService.post<IResponseSuccess<ICreateProductRes>>(`${URL}`, body)
  },

  getListName: () => {
    return axiosService.get<IResponseSuccess<IProductNameRes[]>>(`${URL}/list-name`)
  },

  getProductTable: (param: IFilterProduct) => {
    let newURL = `${URL}/dashboard?page=${param.page}&limit=${param.limit}`

    if (param.search && param.type) {
      newURL += `&search=${param.search}&type=${param.type}`
    }

    if (param.brands) {
      newURL += `&brands=${param.brands}`
    }

    if (param.category) {
      newURL += `&category=${param.category}`
    }

    return axiosService.get<IResponseSuccess<IPagePagination<IProductTable[]>>>(newURL)
  },

  createProductItem: (body: FormData) => {
    return axiosService.post<IResponseSuccess<ICreateProductItemRes>>(`${URL}/item`, body)
  },

  deleteProductItem: (productId: string, productItemId: string) => {
    return axiosService.delete<IResponseSuccess<IDeleteProductItemRes>>(
      `${URL}/dashboard/product-item/${productId}/${productItemId}`
    )
  },

  deleteProduct: (productId: string) => {
    return axiosService.delete<IResponseSuccess<string>>(`${URL}/dashboard/product/${productId}`)
  },

  getProductById: (productId: string) => {
    return axiosService.get<IResponseSuccess<IProductSimPle>>(`${URL}/dashboard/product/${productId}`)
  },

  updateProduct: (productId: string, body: IProductUpdateReq) => {
    return axiosService.put<IResponseSuccess<IProductUpdatedRes>>(`${URL}/dashboard/product/${productId}`, body)
  },

  getProductItem: (productId: string, itemId: string) => {
    return axiosService.get<IResponseSuccess<IProdItemRes>>(
      `${URL}/dashboard/product/${productId}/product-item/${itemId}`
    )
  },

  updateProdItem: (data: IUpdateProdItem) => {
    return axiosService.put<IResponseSuccess<IUpdateProdItemRes>>(
      `${URL}/dashboard/product-item/${data.itemId}`,
      data.body
    )
  },

  checkCategoryUsed: (categoryId: string) => {
    return axiosService.get<IResponseSuccess<boolean>>(`${URL}/check-category-used/${categoryId}`)
  }
}

export default productApi
