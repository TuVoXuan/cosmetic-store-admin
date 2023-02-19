import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'brand'
const URL = `${API}/${ENDPOINT}`

const brandApi = {
  getBrand: () => {
    return axiosService.get<IResponseSuccess<IBrandRes[]>>(`${URL}/list-name`)
  }
}

export default brandApi
