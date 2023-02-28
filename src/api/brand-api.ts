import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'brand'
const URL = `${API}/${ENDPOINT}`

const brandApi = {
  getBrand: () => {
    return axiosService.get<IResponseSuccess<IBrandRes[]>>(`${URL}/list-name`)
  },

  getBrands: () => {
    return axiosService.get<IResponseSuccess<IBrand[]>>(`${URL}`)
  },

  createBrand: (body: FormData) => {
    return axiosService.post<IResponseSuccess<IBrand>>(`${URL}`, body)
  },

  updateBrand: (body: UpdateBrand) => {
    const formData = new FormData()
    if (body.name) {
      formData.append('name', body.name)
    }
    if (body.logo) {
      formData.append('logo', body.logo)
    }

    return axiosService.put<IResponseSuccess<IBrand>>(`${URL}/${body._id}`, formData)
  },

  deleteBrand: (param: string) => {
    return axiosService.delete<IResponseSuccess<string>>(`${URL}/${param}`)
  }
}

export default brandApi
