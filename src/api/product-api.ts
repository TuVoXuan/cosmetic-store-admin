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

  getProductTable: () => {
    return axiosService.get<IResponseSuccess<IProductTable[]>>(`${URL}/dashboard`)
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
  }
}

export default productApi
