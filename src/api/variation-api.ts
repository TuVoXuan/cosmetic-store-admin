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
  },

  addOptions: (body: AddOptions) => {
    return axiosService.post<IResponseSuccess<IVariationOption[]>>(`${URL}/options`, body)
  },

  deleteOption: (param: string) => {
    return axiosService.delete<IResponseSuccess<string>>(`${URL}/option/${param}`)
  },

  deleteVariation: (id: string) => {
    return axiosService.delete<IResponseSuccess<string>>(`${URL}/${id}`)
  }
}

export default variationApi
