import { createAsyncThunk } from '@reduxjs/toolkit'
import variationApi from '../../api/variation-api'

export const getVariations = createAsyncThunk('variations', async (_body, thunkAPI) => {
  try {
    const response = await variationApi.getVariationTable()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createVariation = createAsyncThunk('variations/create', async (body: CreateVariation, thunkAPI) => {
  try {
    const response = await variationApi.createVariation(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const addOptions = createAsyncThunk('variations/options/create', async (body: AddOptions, thunkAPI) => {
  try {
    const response = await variationApi.addOptions(body)

    return {
      parentVariation: body.parentVariation,
      variationOptions: response.data.data
    } as IAddVariationOption
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteOption = createAsyncThunk(
  'variations/options/delete',
  async (param: DeleteVariationOption, thunkAPI) => {
    try {
      await variationApi.deleteOption(param.children)

      return param
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteVariation = createAsyncThunk('variations/delete', async (id: string, thunkAPI) => {
  try {
    const response = await variationApi.deleteVariation(id)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
