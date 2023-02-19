declare interface IVariationOptionsRes {
  variation: {
    _id: string
    name: ITranslate[]
  }
  variationOptions: {
    _id: string
    value: ITranslate[]
  }[]
}
