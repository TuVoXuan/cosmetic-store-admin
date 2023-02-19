import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'category'
const URL = `${API}/${ENDPOINT}`

const categoryApi = {
  getCategory: () => {
    return axiosService.get<IResponseSuccess<INameTranslateRes[]>>(`${URL}/leaf`)
  }
}

export default categoryApi
