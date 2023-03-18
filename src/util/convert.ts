import { OrderStatus } from '../types/enum'

export const formatPrice = (price: number) => {
  return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

export const formatDate = (date: string) => {
  const d = new Date(date)

  return (
    [padTo2Digits(d.getDate()), padTo2Digits(d.getMonth() + 1), d.getFullYear()].join('/') +
    ' ' +
    [padTo2Digits(d.getHours()), padTo2Digits(d.getMinutes()), padTo2Digits(d.getSeconds())].join(':')
  )
}

export const translateOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'Đang giao hàng'
    case OrderStatus.Completed:
      return 'Đã giao'
    case OrderStatus.Delivering:
      return 'Đang giao hàng'
    case OrderStatus.NotAcceptOrder:
      return 'Không nhận hàng'
    case OrderStatus.Cancelled:
      return 'Đã hủy'

    default:
      return ''
  }
}
