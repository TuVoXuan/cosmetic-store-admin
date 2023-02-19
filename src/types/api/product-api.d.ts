declare interface ICreateProduct {
  name: ITranslate[]
  description: ITranslate[]
  categories: string[]
  variations: string[]
  brand: string
}

declare interface IProductNameRes {
  _id: string
  name: ITranslate[]
  variations: string[]
}

declare interface IProductNameOption extends IOption {
  variations: string[]
}
