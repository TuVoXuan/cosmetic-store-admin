import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'order'
const URL = `${API}/${ENDPOINT}`

export const orderApi = {
  getOrders: async (param: IGetOrdersParam) => {
    let query = `?page=${param.page}&limit=${param.limit}`

    if (param.id) {
      query += `&id=${param.id}`
    }

    if (param.from) {
      query += `&from=${param.from}`
    }

    if (param.to) {
      query += `&to=${param.to}`
    }

    const response = await axiosService.get<IResponseSuccess<IPagePagination<IOrderTable[]>>>(
      `${URL}/dashboard/status/${param.status}${query}`
    )

    return response.data.data
  },

  getOrderDetail: async (id: string) => {
    const response = await axiosService.get<IResponseSuccess<IOrderDetail>>(`${URL}/detail/${id}`)

    return response.data.data
  },

  updateOrderStatus: async (param: IUpdateOrderStatus) => {
    const response = await axiosService.put<IResponseSuccess<string>>(`${URL}/status/${param.id}`, {
      status: param.status
    })

    return response.data.data
  }
}
