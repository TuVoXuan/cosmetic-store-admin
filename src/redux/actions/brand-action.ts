import { createAsyncThunk } from '@reduxjs/toolkit'
import brandApi from '../../api/brand-api'

export const getBrands = createAsyncThunk('brands', async (_body, thunkAPI) => {
  try {
    const response = await brandApi.getBrands()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createBrand = createAsyncThunk('brands/create', async (body: CreateBrand, thunkAPI) => {
  try {
    const formData = new FormData()
    formData.append('name', body.name)
    formData.append('logo', body.logo)
    const response = await brandApi.createBrand(formData)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateBrand = createAsyncThunk('brands/update', async (body: UpdateBrand, thunkAPI) => {
  try {
    const response = await brandApi.updateBrand(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteBrand = createAsyncThunk('brands/delete', async (param: string, thunkAPI) => {
  try {
    const response = await brandApi.deleteBrand(param)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
