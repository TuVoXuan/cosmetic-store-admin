import { createAsyncThunk } from '@reduxjs/toolkit'
import productApi from '../../api/product-api'

export const getProducts = createAsyncThunk('products', async (_body, thunkAPI) => {
  try {
    const response = await productApi.getProductTable()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (data: string, thunkAPI) => {
  try {
    const response = await productApi.deleteProduct(data)
    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
