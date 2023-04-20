import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import {
  getOrderDailyReport,
  getOrderOverview,
  getOrderRevenueOrRefund,
  getRevenueOfLastYear,
  getSellingProduct
} from '../actions/dashboard-action'
import { IResGetSellingProducts, ISellingProduct } from '../../types/api/product-api'

export interface DashboardState {
  orderRevenueOrRefund: {
    month: {
      thisYear: IRevenueValue[]
      lastYear: IRevenueValue[]
    }
    week: {
      revenue: IRevenueValue[]
      refund: IRevenueValue[]
    }
  }
  orderOverview: {
    month: IOrderOverview[]
    week: IOrderOverview[]
  }
  dailyReport: IOrderDailyReport
  sellingProducts: {
    week: ISellingProduct[]
    month: ISellingProduct[]
  }
}

const initialState: DashboardState = {
  orderRevenueOrRefund: {
    month: {
      thisYear: [],
      lastYear: []
    },
    week: {
      refund: [],
      revenue: []
    }
  },
  orderOverview: {
    month: [],
    week: []
  },
  dailyReport: {
    numOfCancelledOrders: 0,
    numOfCompletedOrders: 0,
    numOfOrders: 0,
    totalRevenueToday: 0
  },
  sellingProducts: {
    week: [],
    month: []
  }
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrderRevenueOrRefund.fulfilled, (state, action: PayloadAction<IRevenueValue[]>) => {
      const data = action.payload

      if (data.length === 12) {
        state.orderRevenueOrRefund.month.thisYear = data
      } else if (data.length === 7) {
        state.orderRevenueOrRefund.week.revenue = data
      }
    })
    builder.addCase(getOrderOverview.fulfilled, (state, action: PayloadAction<IOrderOverviewRes>) => {
      const { data, timeType } = action.payload
      if (timeType === 'month') {
        state.orderOverview.month = data
      } else if (timeType === 'week') {
        state.orderOverview.week = data
      }
    })
    builder.addCase(getOrderDailyReport.fulfilled, (state, action: PayloadAction<IOrderDailyReport>) => {
      state.dailyReport = action.payload
    })
    builder.addCase(getSellingProduct.fulfilled, (state, action: PayloadAction<IResGetSellingProducts>) => {
      const { timeType, data } = action.payload

      if (timeType === 'week') {
        state.sellingProducts.week = data
      } else if (timeType === 'month') {
        state.sellingProducts.month = data
      }
    })
    builder.addCase(getRevenueOfLastYear.fulfilled, (state, action: PayloadAction<IRevenueValue[]>) => {
      state.orderRevenueOrRefund.month.lastYear = action.payload
    })
  }
})

export const selectDashboard = (state: RootState) => state.dashboard

export default dashboardSlice.reducer
