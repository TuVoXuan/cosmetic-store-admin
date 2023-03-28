import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { AdminRole, Gender } from '../../types/enum'
import { getInfo, signIn, updateInfo } from '../actions/user-action'

const initialState: IUser = {
  _id: '',
  birthday: '',
  name: '',
  email: '',
  gender: Gender.Female,
  role: AdminRole.Main
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signIn.fulfilled, (state, action: PayloadAction<ISignInRes>) => {
      if (state) {
        state = action.payload.user
      }
    })
    builder.addCase(getInfo.fulfilled, (state, action: PayloadAction<IUser>) => {
      const { _id, birthday, email, gender, name, role } = action.payload

      state._id = _id
      state.birthday = birthday
      state.email = email
      state.gender = gender
      state.name = name
      state.role = role
    })
    builder.addCase(updateInfo.fulfilled, (state, action: PayloadAction<IUser>) => {
      const { birthday, gender, name } = action.payload

      state.birthday = birthday
      state.gender = gender
      state.name = name
    })
  }
})

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
