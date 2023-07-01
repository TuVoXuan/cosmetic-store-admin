declare interface ICategoryLeaf {
  _id: string
  name: ITranslate[]
}

declare interface ICategory extends ICategoryLeaf {
  children?: ICategory[]
  icon?: string
}

declare interface IUpdateCategory {
  body: FormData
  categoryId: string
}

declare interface ICreateLeafCategoryRes {
  ids: string[]
  newCategory: ICategory
}

declare interface ICreateLeafCategory {
  parentCategory: string
  name: ITranslate[]
}

declare interface IUpdateChildCategory {
  categoryId: string
  nameVi?: string
  nameEn?: string
}

declare interface IUpdateChildCategoryRes {
  ids: string[]
  updatedName: ITranslate[]
}
