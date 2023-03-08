import { createAsyncThunk } from '@reduxjs/toolkit'
import { tagApi } from '../../api/product-tag-api'

export const getTags = createAsyncThunk('tags', async (body, thunkApi) => {
  try {
    const response = await tagApi.getTags()

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createTag = createAsyncThunk('tags/create', async (name: string, thunkApi) => {
  try {
    const response = await tagApi.create(name)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const updateTag = createAsyncThunk('tags/update', async (body: IUpdateTag, thunkApi) => {
  try {
    const response = await tagApi.update(body)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteTag = createAsyncThunk('tags/delete', async (id: string, thunkApi) => {
  try {
    const response = await tagApi.delete(id)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})
