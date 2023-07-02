import { createAsyncThunk } from '@reduxjs/toolkit'
import categoryApi from '../../api/category-api'

export const getCategories = createAsyncThunk('category', async (_body, thunkAPI) => {
  try {
    const response = await categoryApi.getCagetories()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createRootCategory = createAsyncThunk('category/create-root', async (body: FormData, thunkAPI) => {
  try {
    const response = await categoryApi.createRootCategory(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateRootCategory = createAsyncThunk('category/update-root', async (body: IUpdateCategory, thunkAPI) => {
  try {
    const response = await categoryApi.updateRootCategory(body.body, body.categoryId)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createLeafCategory = createAsyncThunk(
  'category/create-leaf',
  async (body: ICreateLeafCategory, thunkAPI) => {
    try {
      const response = await categoryApi.createLeafCategory(body)

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateLeafCategory = createAsyncThunk(
  'category/update-leaf',
  async (body: IUpdateChildCategory, thunkAPI) => {
    try {
      const response = await categoryApi.updateLeafCategory(body)

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteCategory = createAsyncThunk('category/delete', async (categoryId: string, thunkAPI) => {
  try {
    const response = await categoryApi.deleteCategory(categoryId)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
