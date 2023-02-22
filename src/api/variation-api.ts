import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'variation'
const URL = `${API}/${ENDPOINT}`

const variationApi = {
  getVariation: () => {
    return axiosService.get<IResponseSuccess<INameTranslateRes[]>>(`${URL}`)
  },

  getVariationOptions: (parentId: string) => {
    return axiosService.get<IResponseSuccess<IVariationOptionsRes>>(`${URL}/options?parentId=${parentId}`)
  },

  createVariation: (body: CreateVariation) => {
    return axiosService.post<IResponseSuccess<IVariationOptionsRes>>(`${URL}`, body)
  },

  getVariationTable: () => {
    return axiosService.get<IResponseSuccess<IVariationOptionsRes[]>>(`${URL}/table`)
  }
}

export default variationApi
