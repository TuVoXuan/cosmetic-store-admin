import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import {
  createTag,
  createTagGroup,
  deleteTag,
  deleteTagGroup,
  getTags,
  updateTag,
  updateTagGroup
} from '../actions/tag-action'

export interface TagState {
  tagGroups: ITagGroupSlice[]
}

const initialState: TagState = {
  tagGroups: []
}

export const tagsSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTags.fulfilled, (state, action: PayloadAction<ITagGroupSlice[]>) => {
        state.tagGroups = action.payload
      })
      .addCase(createTagGroup.fulfilled, (state, action: PayloadAction<ISubTagGroup>) => {
        state.tagGroups.push({
          ...action.payload,
          children: []
        })
      })
      .addCase(createTag.fulfilled, (state, action: PayloadAction<ITag>) => {
        const { _id, name, parent, weight } = action.payload
        const tagGroup = state.tagGroups.find(item => item._id === parent)
        if (tagGroup) {
          tagGroup.children.push({ _id: _id, name: name, weight: weight })
        }
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<IUpdateTagRes>) => {
        const { _id, name, parent, weight, oldParent } = action.payload

        if (parent !== oldParent) {
          const tagGroup = state.tagGroups.find(item => item._id === oldParent)
          if (tagGroup) {
            tagGroup.children = tagGroup.children.filter(item => item._id !== _id)
          }

          const newTagGroup = state.tagGroups.find(item => item._id === parent)
          if (newTagGroup) {
            newTagGroup.children.push({
              _id,
              name,
              weight
            })
          }
        } else {
          const tagGroup = state.tagGroups.find(item => item._id === parent)
          if (tagGroup) {
            const oldTag = tagGroup.children.find(tag => tag._id === _id)
            if (oldTag) {
              oldTag.name = name
              oldTag.weight = weight
            }
          }
        }
      })
      .addCase(deleteTag.fulfilled, (state, action: PayloadAction<IDeleteTag>) => {
        const { _id, parent } = action.payload
        const tagGroup = state.tagGroups.find(item => item._id === parent)
        console.log('tagGroup: ', tagGroup)
        if (tagGroup) {
          tagGroup.children = tagGroup.children.filter(tag => tag._id !== _id)
        }
      })
      .addCase(updateTagGroup.fulfilled, (state, action: PayloadAction<ISubTagGroup>) => {
        const { _id, name } = action.payload
        const tagGroup = state.tagGroups.find(item => item._id === _id)
        if (tagGroup) {
          tagGroup.name = name
        }
      })
      .addCase(deleteTagGroup.fulfilled, (state, action: PayloadAction<string>) => {
        state.tagGroups = state.tagGroups.filter(tagGroup => tagGroup._id !== action.payload)
      })
  }
})

export const selectTags = (state: RootState) => state.tags

export default tagsSlice.reducer
