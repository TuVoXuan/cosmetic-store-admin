import { createAsyncThunk } from '@reduxjs/toolkit'
import { orderApi } from '../../api/order-api'

export const getOrderRevenueOrRefund = createAsyncThunk(
  'dashboard/order-revenue',
  async (body: IRevenueOrRefundReq, thunkAPI) => {
    try {
      const response = await orderApi.getOrderRevenueOrRefund(body)
      return {
        status: body.status,
        data: response.data.data
      }
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
