declare interface IBrandRes {
  _id: string
  name: string
}

declare interface IBrand {
  _id: string
  name: string
  logo: string
}

declare interface CreateBrand {
  name: string
  logo: File
}

declare interface UpdateBrand {
  _id: string
  name?: string
  logo?: File
}
