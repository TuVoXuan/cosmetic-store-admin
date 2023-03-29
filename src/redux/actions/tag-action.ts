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

export const createTag = createAsyncThunk('tags/create', async (body: ICreateTag, thunkApi) => {
  try {
    const response = await tagApi.createTag(body)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const updateTag = createAsyncThunk('tags/update', async (body: IUpdateTag, thunkApi) => {
  try {
    const response = await tagApi.updateTag(body)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteTag = createAsyncThunk('tags/delete', async (id: string, thunkApi) => {
  try {
    const response = await tagApi.deleteTag(id)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const createTagGroup = createAsyncThunk('tags/create-tag-group', async (tagGroupName: string, thunkApi) => {
  try {
    const response = await tagApi.createTagGroup(tagGroupName)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const updateTagGroup = createAsyncThunk('tags/update-tag-group', async (body: ISubTagGroup, thunkApi) => {
  try {
    const response = await tagApi.updateTagGroup(body)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})

export const deleteTagGroup = createAsyncThunk('tags/delete-tag-group', async (tagGroupId: string, thunkApi) => {
  try {
    const response = await tagApi.deleteTagGroup(tagGroupId)

    return response.data.data
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
})
