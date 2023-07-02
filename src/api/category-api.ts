import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'category'
const URL = `${API}/${ENDPOINT}`

const categoryApi = {
  getCategoryLeaf: () => {
    return axiosService.get<IResponseSuccess<INameTranslateRes[]>>(`${URL}/leaf`)
  },

  getCagetories: () => {
    return axiosService.get<IResponseSuccess<ICategory[]>>(URL)
  },

  createRootCategory: (data: FormData) => {
    return axiosService.post<IResponseSuccess<ICategory>>(`${URL}/root`, data)
  },

  updateRootCategory: (data: FormData, categoryId: string) => {
    return axiosService.put<IResponseSuccess<ICategory>>(`${URL}/root/${categoryId}`, data)
  },

  createLeafCategory: (data: ICreateLeafCategory) => {
    return axiosService.post<IResponseSuccess<ICreateLeafCategoryRes>>(`${URL}/leaf`, data)
  },

  updateLeafCategory: (data: IUpdateChildCategory) => {
    return axiosService.put<IResponseSuccess<IUpdateChildCategoryRes>>(`${URL}/child/${data.categoryId}`, {
      nameVi: data.nameVi,
      nameEn: data.nameEn
    })
  },

  deleteCategory: (categoryId: string) => {
    return axiosService.delete<IResponseSuccess<string[]>>(`${URL}/${categoryId}`)
  }
}

export default categoryApi
