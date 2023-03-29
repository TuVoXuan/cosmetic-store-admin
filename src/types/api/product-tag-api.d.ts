declare interface ITag extends ICreateTag {
  _id: string
}

declare interface IUpdateTag extends ICreateTag {
  id: string
}

declare interface ICreateTag {
  name: string
  weight: number
  parent: string
}

declare interface ITagGroupSlice extends ISubTagGroup {
  children: Omit<ITag, 'parent'>[]
}

declare interface ISubTagGroup {
  _id: string
  name: string
}

declare interface IDeleteTag {
  _id: string
  parent: string
}

declare interface IUpdateTagRes extends ITag {
  oldParent: string
}
