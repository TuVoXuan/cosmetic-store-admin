import React, { useContext, useState } from 'react'

interface VariationContextType {
  selectedVariation: IVariation
  setSelectedVariation: (value: IVariation) => void
  setTab: (value: 'create' | 'add-options' | 'update') => void
}

export const VariationContext = React.createContext<VariationContextType>({
  selectedVariation: {
    _id: '',
    name: []
  },
  setSelectedVariation: (value: IVariation) => {
    console.log('value: ', value)
  },
  setTab: (value: 'create' | 'add-options' | 'update') => {
    console.log('value: ', value)
  }
})

export const useVariation = () => useContext(VariationContext)

interface Props {
  children: React.ReactNode | React.ReactNode[]
  setTab: (value: 'create' | 'add-options' | 'update') => void
}

export const VariationProvider = ({ children, setTab }: Props) => {
  const [selectedVariation, setSelectedVariation] = useState<IVariation>({
    _id: '',
    name: []
  })

  return (
    <VariationContext.Provider value={{ selectedVariation, setSelectedVariation, setTab }}>
      {children}
    </VariationContext.Provider>
  )
}
