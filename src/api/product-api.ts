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
    return axiosService.get<IResponseSuccess<IProductSimPle>>(`${URL}/${productId}`)
  },

  updateProduct: (productId: string, body: IProductUpdateReq) => {
    return axiosService.put<IResponseSuccess<IProductUpdatedRes>>(`${URL}/${productId}`, body)
  }
}

export default productApi
