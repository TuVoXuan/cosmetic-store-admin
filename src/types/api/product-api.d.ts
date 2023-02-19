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

declare interface IProductTable {
  _id: string
  name: string
  productItems: {
    _id: string
    price: number
    productConfigurations: {
      _id: string
      value: string
    }[]
  }[]
  brand: {
    _id: string
    name: string
  }[]
  cagetories: {
    _id: string
    name: string
  }[]
}
