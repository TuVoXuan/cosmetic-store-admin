import React, { useContext, useState } from 'react'
import { Search } from '../types/enum'

export interface IFilterProductForm {
  search: string
  type: Search
  brands: IOption[]
  categories: IOption[]
}

interface FilterProductContextType {
  filter: IFilterProductForm
  setFilter: (value: IFilterProductForm) => void
  loading: boolean
  setLoading: (value: boolean) => void
}

export const FilterProductContext = React.createContext<FilterProductContextType>({
  filter: {
    search: '',
    type: Search.Id,
    brands: [],
    categories: []
  },
  setFilter: (value: IFilterProductForm | undefined) => {
    console.log('value: ', value)
  },
  loading: false,
  setLoading: (value: boolean) => {
    console.log('value: ', value)
  }
})

export const useFilterProduct = () => useContext(FilterProductContext)

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export const FilterProductProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<IFilterProductForm>({
    search: '',
    type: Search.Id,
    brands: [],
    categories: []
  })
  const [loading, setLoading] = useState(false)

  return (
    <FilterProductContext.Provider value={{ filter, setFilter, loading, setLoading }}>
      {children}
    </FilterProductContext.Provider>
  )
}
