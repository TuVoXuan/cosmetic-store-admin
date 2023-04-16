declare interface ITranslate {
  language: 'vi' | 'en'
  value: string
}

declare interface ITranslateV2 {
  vi: string
  en: string
}

declare interface IOption {
  label: string
  value: string
}

declare interface IOptionGroup extends IOption {
  group: string
}

declare interface INameTranslateRes {
  _id: string
  name: ITranslate[]
}

declare interface IVariationGroup {
  variationName: string
  variationOptions: IOption[]
}

declare interface IRevenueOrRefundValue {
  value: number
  label: string
}

declare interface IRevenueOrRefundReq {
  timeReport: string
  status: string
}

declare interface IRevenueOrRefundRes {
  status: string
  data: IRevenueOrRefundValue[]
}

declare interface IChartData {
  x: string
  y: number
}

declare interface IOrderOverview {
  status: string
  count: number
}

declare interface IOrderOverviewRes {
  data: IOrderOverview[]
  timeType: string
}

declare interface IOrderDailyReport {
  numOfOrders: number
  numOfCancelledOrders: number
  numOfCompletedOrders: number
  totalRevenueToday: number
}
