import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import productReducer from '../redux/reducers/product-slice'
import variationReducer from '../redux/reducers/variation-slide'
import brandReducer from '../redux/reducers/brand-slice'
import tagReducer from '../redux/reducers/tag-slice'
import userReducer from '../redux/reducers/user-slice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    variations: variationReducer,
    brands: brandReducer,
    tags: tagReducer,
    user: userReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
