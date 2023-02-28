import React, { useContext, useState } from 'react'

interface BrandContextType {
  selectedBrand: IBrand | undefined
  setSelectedBrand: (value: IBrand | undefined) => void
}

export const BrandContext = React.createContext<BrandContextType>({
  selectedBrand: undefined,
  setSelectedBrand: (value: IBrand | undefined) => {
    console.log('value: ', value)
  }
})

export const useBrand = () => useContext(BrandContext)

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export const BrandProvider = ({ children }: Props) => {
  const [selectedBrand, setSelectedBrand] = useState<IBrand | undefined>(undefined)

  return <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>{children}</BrandContext.Provider>
}
