import { createAsyncThunk } from '@reduxjs/toolkit'
import productApi from '../../api/product-api'
import { IFilterProduct, IProductUpdateReq, IUpdateProdItem } from '../../types/api/product-api'

export const getProducts = createAsyncThunk('products', async (param: IFilterProduct, thunkAPI) => {
  try {
    const response = await productApi.getProductTable(param)

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

export const updateProduct = createAsyncThunk(
  'products/update',
  async (data: { productId: string; body: IProductUpdateReq }, thunkAPI) => {
    try {
      const response = await productApi.updateProduct(data.productId, data.body)

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateProdItem = createAsyncThunk('products/update-item', async (data: IUpdateProdItem, thunkAPI) => {
  try {
    const response = await productApi.updateProdItem(data)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
