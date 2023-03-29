import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'tag'
const URL = `${API}/${ENDPOINT}`

export const tagApi = {
  getTags: async () => {
    const response = await axiosService.get<IResponseSuccess<ITagGroupSlice[]>>(URL)
    return response
  },

  createTag: async (body: ICreateTag) => {
    const response = await axiosService.post<IResponseSuccess<ITag>>(URL, body)

    return response
  },

  updateTag: async (body: IUpdateTag) => {
    const response = await axiosService.put<IResponseSuccess<ITag>>(URL, body)

    return response
  },

  deleteTag: async (id: string) => {
    const response = await axiosService.delete<IResponseSuccess<IDeleteTag>>(`${URL}/${id}`)

    return response
  },

  createTagGroup: async (tagGroupName: string) => {
    const response = await axiosService.post<IResponseSuccess<ISubTagGroup>>(`${URL}/tag-group`, {
      name: tagGroupName
    })

    return response
  },

  updateTagGroup: async (value: ISubTagGroup) => {
    const response = await axiosService.put<IResponseSuccess<ISubTagGroup>>(`${URL}/tag-group/${value._id}`, {
      name: value.name
    })

    return response
  },

  deleteTagGroup: async (tagGroupId: string) => {
    const response = await axiosService.delete<IResponseSuccess<string>>(`${URL}/tag-group/${tagGroupId}`)

    return response
  }
}
