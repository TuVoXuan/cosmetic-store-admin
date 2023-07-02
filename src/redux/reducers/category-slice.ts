import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { createBrand, deleteBrand, getBrands, updateBrand } from '../actions/brand-action'
import {
  createLeafCategory,
  createRootCategory,
  deleteCategory,
  getCategories,
  updateLeafCategory,
  updateRootCategory
} from '../actions/category-action'

export interface BrandState {
  categories: ICategory[]
}

const initialState: BrandState = {
  categories: []
}

export const categoriesSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
        state.categories = action.payload
      })
      .addCase(createRootCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
        state.categories.push({ ...action.payload, children: [] })
      })
      .addCase(updateRootCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
        const updateCategory = state.categories.find(cate => cate._id === action.payload._id)
        if (updateCategory) {
          updateCategory.icon = action.payload.icon
          updateCategory.name = action.payload.name
        }
      })
      .addCase(createLeafCategory.fulfilled, (state, action: PayloadAction<ICreateLeafCategoryRes>) => {
        const { ids, newCategory } = action.payload
        const root = state.categories.find(item => item._id === ids[0])
        if (root && ids.length === 2) {
          root.children?.push({ ...newCategory, children: [] })
        } else if (root && ids.length === 3) {
          const parentCate = root.children?.find(item => item._id === ids[1])
          if (parentCate) {
            parentCate.children?.push(newCategory)
          }
        }
      })
      .addCase(updateLeafCategory.fulfilled, (state, action: PayloadAction<IUpdateChildCategoryRes>) => {
        const { ids, updatedName } = action.payload
        const root = state.categories.find(item => item._id === ids[0])
        if (root && ids.length === 2) {
          const updateCate = root.children?.find(cate => cate._id === ids[1])
          if (updateCate) {
            updateCate.name = updatedName
          }
        } else if (root && ids.length === 3) {
          const parentCate = root.children?.find(item => item._id === ids[1])
          if (parentCate) {
            const updateCate = parentCate.children?.find(cate => cate._id === ids[2])
            if (updateCate) {
              updateCate.name = updatedName
            }
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string[]>) => {
        const ids = action.payload
        console.log('ids: ', ids)
        const root = state.categories.find(item => item._id === ids[0])
        if (ids.length === 1) {
          state.categories = state.categories.filter(cate => cate._id !== ids[0])
        } else if (root && ids.length === 2 && root.children) {
          root.children = root.children.filter(cate => cate._id !== ids[1])
        } else if (root && ids.length === 3) {
          const parentCate = root.children?.find(item => item._id === ids[1])
          if (parentCate && parentCate.children) {
            parentCate.children = parentCate.children.filter(cate => cate._id !== ids[2])
          }
        }
      })
  }
})

export const selectCategories = (state: RootState) => state.categories

export default categoriesSlice.reducer
