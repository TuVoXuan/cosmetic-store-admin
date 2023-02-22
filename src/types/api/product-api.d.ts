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

declare interface IProductItemTable {
  _id: string
  price: number
  quantity: number
  productConfigurations: {
    _id: string
    value: string
  }[]
}

declare interface IProductTable {
  _id: string
  name: string
  productItems: IProductItemTable[]
  brand: {
    _id: string
    name: string
  }[]
  cagetories: {
    _id: string
    name: string
  }[]
}

declare interface IDeleteProductItemRes {
  productId: string
  productItemId: string
}

declare interface ICreateProductItemRes {
  productId: string
  productItem: IProductItemTable
}
