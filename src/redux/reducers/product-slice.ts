import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { deleteProduct, getProducts } from '../actions/product-action'

export interface ProductState {
  products: IProductTable[]
}

const initialState: ProductState = {
  products: []
}

export const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProductItem: (state, action: PayloadAction<ICreateProductItemRes>) => {
      const { productId, productItem } = action.payload
      const productFound = state.products.find(product => product._id === productId)
      if (productFound) {
        productFound.productItems.push(productItem)
      }
    },

    removeProductItem: (state, action: PayloadAction<IDeleteProductItemRes>) => {
      const { productId, productItemId } = action.payload
      const productFound = state.products.find(product => product._id === productId)
      if (productFound) {
        productFound.productItems = productFound.productItems.filter(item => item._id !== productItemId)
      }
    },

    addProduct: (state, action: PayloadAction<ICreateProductRes>) => {
      const newProduct = action.payload
      state.products.push({ ...newProduct, productItems: [] })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<IProductTable[]>) => {
        state.products = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        const productId = action.payload
        state.products = state.products.filter(product => product._id !== productId)
      })
  }
})

export const { removeProductItem, addProductItem, addProduct } = productsSlice.actions

export const selectProducts = (state: RootState) => state.products

export default productsSlice.reducer
