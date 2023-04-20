import { createAsyncThunk } from '@reduxjs/toolkit'
import { orderApi } from '../../api/order-api'
import { IGetSellingProducts } from '../../types/api/product-api'

export const getOrderRevenueOrRefund = createAsyncThunk(
  'dashboard/order-revenue',
  async (body: IRevenueReq, thunkAPI) => {
    try {
      const response = await orderApi.getOrderRevenueOrRefund(body)

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getOrderOverview = createAsyncThunk('dashboard/order-overview', async (timeType: string, thunkAPI) => {
  try {
    const response = await orderApi.getOrderOverview(timeType)

    return {
      timeType,
      data: response.data.data
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getOrderDailyReport = createAsyncThunk('dashboard/order-daily-report', async (_body, thunkAPI) => {
  try {
    const response = await orderApi.getOrderDailyReport()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getSellingProduct = createAsyncThunk(
  'dashboard/selling-product',
  async (body: IGetSellingProducts, thunkAPI) => {
    try {
      const response = await orderApi.getSellingProductsFollowTime(body.timeType, body.limit)

      return {
        timeType: body.timeType,
        data: response
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getRevenueOfLastYear = createAsyncThunk('dashboard/revenue-last-year', async (body: string, thunkAPI) => {
  try {
    const response = await orderApi.getRevenueOfLastYear(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
