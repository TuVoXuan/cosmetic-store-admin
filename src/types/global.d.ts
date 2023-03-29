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
