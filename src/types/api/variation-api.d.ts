declare interface IVariationOptionsRes {
  variationName: {
    _id: string
    name: ITranslate[]
  }
  variationOptions: {
    _id: string
    value: ITranslate[]
  }[]
}
