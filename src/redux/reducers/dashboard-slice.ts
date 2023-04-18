import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import {
  getOrderDailyReport,
  getOrderOverview,
  getOrderRevenueOrRefund,
  getSellingProduct
} from '../actions/dashboard-action'
import { IResGetSellingProducts, ISellingProduct } from '../../types/api/product-api'

export interface DashboardState {
  orderRevenueOrRefund: {
    month: {
      revenue: IRevenueOrRefundValue[]
      refund: IRevenueOrRefundValue[]
    }
    week: {
      revenue: IRevenueOrRefundValue[]
      refund: IRevenueOrRefundValue[]
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
      refund: [],
      revenue: []
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
    builder.addCase(getOrderRevenueOrRefund.fulfilled, (state, action: PayloadAction<IRevenueOrRefundRes>) => {
      if (action.payload.status === 'completed') {
        if (action.payload.data.length === 12) {
          state.orderRevenueOrRefund.month.revenue = action.payload.data
        } else if (action.payload.data.length === 7) {
          state.orderRevenueOrRefund.week.revenue = action.payload.data
        }
      } else if (action.payload.status === 'notAcceptOrder') {
        if (action.payload.data.length === 12) {
          state.orderRevenueOrRefund.month.refund = action.payload.data
        } else if (action.payload.data.length === 7) {
          state.orderRevenueOrRefund.week.refund = action.payload.data
        }
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
  }
})

export const selectDashboard = (state: RootState) => state.dashboard

export default dashboardSlice.reducer
