import { createAsyncThunk } from '@reduxjs/toolkit'
import { settingApi } from '../../api/setting-api'

export const getShippingFeePerKM = createAsyncThunk('setting/shipping-fee-per-km', async (_body, thunkApi) => {
  try {
    const response = await settingApi.getShippingFeePerKM()

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const updateShippingFeePerKM = createAsyncThunk(
  'setting/update-shipping-fee-per-km',
  async (value: number, thunkApi) => {
    try {
      const response = await settingApi.updateShippingFeePerKM(value)

      return response.data.data
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)
