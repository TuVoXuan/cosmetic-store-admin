import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { getOrderDailyReport, getOrderOverview, getOrderRevenueOrRefund } from '../actions/dashboard-action'

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
  }
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrderRevenueOrRefund.fulfilled, (state, action: PayloadAction<IRevenueOrRefundRes>) => {
      const { status, data } = action.payload
      if (status === 'completed') {
        if (data.length === 12) {
          state.orderRevenueOrRefund.month.revenue = data
        } else if (data.length === 7) {
          state.orderRevenueOrRefund.week.revenue = data
        }
      } else if (status === 'notAcceptOrder' || status === 'cancelled') {
        if (data.length === 12) {
          if (state.orderRevenueOrRefund.month.refund.length === 0) {
            state.orderRevenueOrRefund.month.refund = data
          } else {
            for (const month of state.orderRevenueOrRefund.month.refund) {
              const foundMonth = data.find(item => item.label === month.label)
              if (foundMonth) {
                month.value += foundMonth.value
              }
            }
          }
        } else if (data.length === 7) {
          if (state.orderRevenueOrRefund.week.refund.length === 0) {
            state.orderRevenueOrRefund.week.refund = data
          } else {
            for (const day of state.orderRevenueOrRefund.week.refund) {
              const foundDay = data.find(item => item.label === day.label)
              if (foundDay) {
                day.value += foundDay.value
              }
            }
          }
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
  }
})

export const selectDashboard = (state: RootState) => state.dashboard

export default dashboardSlice.reducer
