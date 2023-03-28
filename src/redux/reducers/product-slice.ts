import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/configureStore'
import { IPagePagination } from '../../types/api/order-api'
import {
  IProductTable,
  ICreateProductItemRes,
  IDeleteProductItemRes,
  ICreateProductRes,
  IProductUpdatedRes,
  IUpdateProdItemRes
} from '../../types/api/product-api'
import { deleteProduct, getProducts, updateProdItem, updateProduct } from '../actions/product-action'

export interface ProductState {
  products: IProductTable[]
  total: number
}

const initialState: ProductState = {
  products: [],
  total: 0
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
    },

    resetProducts: state => {
      ;(state.products = []), (state.total = 0)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<IPagePagination<IProductTable[]>>) => {
        state.products = [...state.products, ...action.payload.data]
        state.total = action.payload.total
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        const productId = action.payload
        state.products = state.products.filter(product => product._id !== productId)
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<IProductUpdatedRes>) => {
        const updatedProduct = action.payload
        console.log('updatedProduct: ', updatedProduct)
        const product = state.products.find(prod => prod._id === updatedProduct._id)
        if (product) {
          product.name = updatedProduct.name
          product.brand = updatedProduct.brand
          product.categories = updatedProduct.categories
        }
      })
      .addCase(updateProdItem.fulfilled, (state, action: PayloadAction<IUpdateProdItemRes>) => {
        const { prodItem, productId } = action.payload
        const product = state.products.find(prod => prod._id === productId)
        if (product) {
          const prodItemFound = product.productItems.find(item => item._id === prodItem._id)
          if (prodItemFound) {
            prodItemFound.price = prodItem.price
            prodItemFound.productConfigurations = prodItem.productConfigurations
            prodItemFound.quantity = prodItem.quantity
          }
        }
      })
  }
})

export const { removeProductItem, addProductItem, addProduct, resetProducts } = productsSlice.actions

export const selectProducts = (state: RootState) => state.products

export default productsSlice.reducer
