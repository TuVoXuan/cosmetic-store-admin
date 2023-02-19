declare interface ITranslate {
  language: 'vi' | 'en'
  value: string
}

declare interface IOption {
  label: string
  value: string
}

declare interface INameTranslateRes {
  _id: string
  name: ITranslate[]
}

declare interface IVariationGroup {
  variationName: string
  variationOptions: IOption[]
}
