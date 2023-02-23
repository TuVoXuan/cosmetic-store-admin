import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { addOptions, createVariation, getVariations } from '../actions/variation-action'

export interface VariationState {
  variations: IVariationOptionsRes[]
}

const initialState: VariationState = {
  variations: []
}

export const variationsSlice = createSlice({
  name: 'variation',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getVariations.fulfilled, (state, action: PayloadAction<IVariationOptionsRes[]>) => {
      state.variations = action.payload
    })
    builder.addCase(createVariation.fulfilled, (state, action: PayloadAction<IVariationOptionsRes>) => {
      state.variations.push(action.payload)
    })
    builder.addCase(addOptions.fulfilled, (state, action: PayloadAction<IAddVariationOption>) => {
      const variation = state.variations.find(item => item.variation._id === action.payload.parentVariation)
      for (const option of action.payload.variationOptions) {
        variation?.variationOptions.push(option)
      }
    })
  }
})

export const selectVariations = (state: RootState) => state.variations

export default variationsSlice.reducer
