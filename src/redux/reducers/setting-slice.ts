import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { getShippingFeePerKM, updateShippingFeePerKM } from '../actions/setting-action'

export interface SettingState {
  shippingFeePerKM: number
}

const initialState: SettingState = {
  shippingFeePerKM: 0
}
export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getShippingFeePerKM.fulfilled, (state, action: PayloadAction<number>) => {
      state.shippingFeePerKM = action.payload
    })
    builder.addCase(updateShippingFeePerKM.fulfilled, (state, action: PayloadAction<number>) => {
      state.shippingFeePerKM = action.payload
    })
  }
})

export const selectSetting = (state: RootState) => state.setting

export default settingSlice.reducer
