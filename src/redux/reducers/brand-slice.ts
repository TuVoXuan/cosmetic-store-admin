import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { createBrand, deleteBrand, getBrands, updateBrand } from '../actions/brand-action'

export interface BrandState {
  brands: IBrand[]
}

const initialState: BrandState = {
  brands: []
}

export const brandsSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getBrands.fulfilled, (state, action: PayloadAction<IBrand[]>) => {
      state.brands = action.payload
    })
    builder.addCase(createBrand.fulfilled, (state, action: PayloadAction<IBrand>) => {
      state.brands.push(action.payload)
    })
    builder.addCase(updateBrand.fulfilled, (state, action: PayloadAction<IBrand>) => {
      const brand = state.brands.find(item => item._id === action.payload._id)

      if (brand) {
        brand.logo = action.payload.logo
        brand.name = action.payload.name
      }
    })
    builder.addCase(deleteBrand.fulfilled, (state, action: PayloadAction<string>) => {
      state.brands = state.brands.filter(item => item._id !== action.payload)
    })
  }
})

export const selectBrands = (state: RootState) => state.brands

export default brandsSlice.reducer
