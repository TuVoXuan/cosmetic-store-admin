import { setCookie } from 'cookies-next'
import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'admin'
const URL = `${API}/${ENDPOINT}`

export const userApi = {
  signIn: async (body: ISignIn) => {
    const response = await axiosService.post<IResponseSuccess<ISignInRes>>(`${URL}/sign-in`, body)

    setCookie('Authorization', response.data.data.token)

    return response
  },

  getInfo: async () => {
    const response = await axiosService.get<IResponseSuccess<IUser>>(URL)

    return response
  },

  updateInfo: async (body: UpdateUser) => {
    const response = await axiosService.put<IResponseSuccess<IUser>>(URL, body)

    return response
  },

  changePass: async (body: ChangePass) => {
    const response = await axiosService.put<IResponseSuccess<string>>(`${URL}/change-pass`, body)

    return response.data.data
  }
}
