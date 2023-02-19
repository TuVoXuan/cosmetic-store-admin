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
  }
}

export default productApi
