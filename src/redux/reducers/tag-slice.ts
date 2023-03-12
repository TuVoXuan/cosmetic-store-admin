import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { createTag, deleteTag, getTags, updateTag } from '../actions/tag-action'

export interface TagState {
  tags: ITag[]
}

const initialState: TagState = {
  tags: []
}

export const tagsSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getTags.fulfilled, (state, action: PayloadAction<ITag[]>) => {
      state.tags = action.payload
    })
    builder.addCase(createTag.fulfilled, (state, action: PayloadAction<ITag>) => {
      state.tags.push(action.payload)
    })
    builder.addCase(updateTag.fulfilled, (state, action: PayloadAction<ITag>) => {
      const tag = state.tags.find(item => item._id === action.payload._id)

      if (tag) {
        tag.name = action.payload.name
        tag.weight = action.payload.weight
      }
    })
    builder.addCase(deleteTag.fulfilled, (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(item => item._id !== action.payload)
    })
  }
})

export const selectTags = (state: RootState) => state.tags

export default tagsSlice.reducer
