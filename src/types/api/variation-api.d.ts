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

declare interface CreateVariation {
  name: ITranslate[]
  options: ITranslateV2[]
}

declare interface AddOptions {
  parentVariation: string
  options: ITranslateV2[]
}

declare interface IAddVariationOption {
  parentVariation: string
  variationOptions: IVariationOption[]
}

declare interface IVariation {
  _id: string
  name: ITranslate[]
}

declare interface IVariationOption {
  _id: string
  value: ITranslate[]
}
