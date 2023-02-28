declare interface ICreateProduct {
  name: ITranslate[]
  description: ITranslate[]
  categories: string[]
  variations?: string[]
  brand: string
}

declare interface ICreateProductRes {
  _id: string
  name: string
  brand: {
    _id: string
    name: string
  }[]
  categories: {
    _id: string
    name: string
  }[]
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
  categories: {
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

declare interface IProductSimPle {
  _id: string
  name: ITranslate[]
  description: ITranslate[]
  categories: string[]
  brand: string
}

declare interface IProductUpdateReq {
  name: ITranslate[]
  description: ITranslate[]
  categories: string[]
  brand: string
}

declare interface IProductUpdatedRes {
  _id: string
  name: string
  brand: {
    _id: string
    name: string
  }[]
  categories: {
    _id: string
    name: string
  }[]
}

declare interface IProdtem {
  _id: string
  price: number
  quantity: number
  thumbnail: string
  images: string[]
  productConfigurations: string[]
}

declare interface IProdItemRes {
  variations: string[]
  prodItem: IProdtem
}

declare interface IUpdateProdItem {
  itemId: string
  body: FormData
}

declare interface IUpdateProdItemRes {
  productId: string
  prodItem: IProductItemTable
}
