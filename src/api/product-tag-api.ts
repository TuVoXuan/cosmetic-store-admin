import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'tag'
const URL = `${API}/${ENDPOINT}`

export const tagApi = {
  getTags: async () => {
    const response = await axiosService.get<IResponseSuccess<ITag[]>>(URL)

    return response
  },

  create: async (body: ICreateTag) => {
    const response = await axiosService.post<IResponseSuccess<ITag>>(URL, body)
    return response
  },

  update: async (body: IUpdateTag) => {
    const response = await axiosService.put<IResponseSuccess<ITag>>(URL, body)

    return response
  },

  delete: async (id: string) => {
    const response = await axiosService.delete<IResponseSuccess<string>>(`${URL}/${id}`)

    return response
  }
}
