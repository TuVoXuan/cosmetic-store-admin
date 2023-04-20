import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'setting'
const URL = `${API}/${ENDPOINT}`

export const settingApi = {
  getShippingFeePerKM: () => {
    return axiosService.get<IResponseSuccess<number>>(`${URL}/shipping-fee-per-km`)
  },

  updateShippingFeePerKM: (value: number) => {
    return axiosService.put<IResponseSuccess<number>>(`${URL}/shipping-fee-per-km`, { fee: value })
  }
}
