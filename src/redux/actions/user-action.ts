import { createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from '../../api/user-api'

export const signIn = createAsyncThunk('user/sign-in', async (body: ISignIn, thunkAPI) => {
  try {
    const response = await userApi.signIn(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getInfo = createAsyncThunk('user/info', async (_body, thunkAPI) => {
  try {
    const response = await userApi.getInfo()

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateInfo = createAsyncThunk('user/info/update', async (body: UpdateUser, thunkAPI) => {
  try {
    const response = await userApi.updateInfo(body)

    return response.data.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk('user/logout', async (_body, thunkAPI) => {
  try {
    return 'logout'
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
