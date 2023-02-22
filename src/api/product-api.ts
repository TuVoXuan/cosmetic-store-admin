import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'product'
const URL = `${API}/${ENDPOINT}`

const productApi = {
  create: (body: ICreateProduct) => {
    return axiosService.post<IResponseSuccess<ICreateProduct>>(`${URL}`, body)
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
  }
}

export default productApi
