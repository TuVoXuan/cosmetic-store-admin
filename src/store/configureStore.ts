import { AnyAction, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import productReducer from '../redux/reducers/product-slice'
import variationReducer from '../redux/reducers/variation-slide'
import brandReducer from '../redux/reducers/brand-slice'
import tagReducer from '../redux/reducers/tag-slice'
import userReducer from '../redux/reducers/user-slice'
import dashboardSlice from '../redux/reducers/dashboard-slice'

const combineReducer = combineReducers({
  products: productReducer,
  variations: variationReducer,
  brands: brandReducer,
  tags: tagReducer,
  user: userReducer,
  dashboard: dashboardSlice
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'user/logout/fulfilled') {
    // check for action type
    state = {} as RootState
  }

  return combineReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof combineReducer>

export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
