declare interface ITag extends ICreateTag {
  _id: string
}

declare interface IUpdateTag extends ICreateTag {
  id: string
}

declare interface ICreateTag {
  name: string
  weight: number
}
