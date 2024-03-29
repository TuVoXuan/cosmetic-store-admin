import { IGetOrdersParam, IOrderDetail, IOrderTable, IPagePagination, IUpdateOrderStatus } from '../types/api/order-api'
import { ISellingProduct } from '../types/api/product-api'
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
  },

  refundOrder: async (orderId: string) => {
    const response = await axiosService.post<IResponseSuccess<string>>(`${URL}/refund/${orderId}`)

    return response.data.data
  },

  getOrderRevenueOrRefund: async (body: IRevenueReq) => {
    const response = await axiosService.post<IResponseSuccess<IRevenueValue[]>>(`${URL}/revenue-follow-time`, body)

    return response
  },

  getOrderOverview: async (timeType: string) => {
    const response = await axiosService.post<IResponseSuccess<IOrderOverview[]>>(`${URL}/overview-follow-time`, {
      timeReport: timeType
    })

    return response
  },

  getOrderDailyReport: async () => {
    const response = await axiosService.get<IResponseSuccess<IOrderDailyReport>>(`${URL}/daily-report`)

    return response
  },

  getSellingProductsFollowTime: async (timeType: 'week' | 'month', limit: number) => {
    const response = await axiosService.post<IResponseSuccess<ISellingProduct[]>>(
      `${URL}/selling-products-follow-time`,
      {
        timeReport: timeType,
        limit
      }
    )

    return response.data.data
  },

  getRevenueOfLastYear: async (categoryId: string) => {
    const response = await axiosService.get<IResponseSuccess<IRevenueValue[]>>(
      `${URL}/revenue-of-last-year/${categoryId}`
    )

    return response
  }
}
