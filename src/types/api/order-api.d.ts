import { OrderStatus, PaymentMethod } from '../enum'

declare interface IOrderTable {
  _id: string
  date: string
  paymentMethod: PaymentMethod
  total: number
  orderId: string
}

declare interface IPagePaginationParam {
  page: number
  limit: number
}

declare interface IGetOrdersParam extends IPagePaginationParam {
  status: OrderStatus
  id?: string
  from?: string
  to?: string
}

declare interface IPagePagination<T> {
  data: T
  total: number
}

declare interface IOrderItem {
  _id: string
  name: ITranslate[]
  quantity: number
  price: number
  thumbnail: string
}

declare interface ICoordinates {
  latitude: number
  longitude: number
}

declare interface IAddress {
  _id: string
  coordinates: ICoordinates
  default: boolean
  district: string
  name: string
  phone: string
  province: string
  specificAddress: string
  ward: string
}

declare interface IOrderDetail {
  _id: string
  date: string
  paymentMethod: PaymentMethod
  orderId: string
  shippingFee: number
  address: IAddress
  orderItems: IOrderItem[]
}

declare interface IUpdateOrderStatus {
  id: string
  status: OrderStatus
}
