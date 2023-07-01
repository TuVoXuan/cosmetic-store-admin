import React, { useContext, useState } from 'react'

interface CategoryContextType {
    selectedCategory: ICategory | undefined
    setSelectedCategory: (value: ICategory | undefined) => void
    actionWithLeafCategory: string | undefined;
    setActionWithLeafCategory: (value: string | undefined) => void
}

export const CategoryContext = React.createContext<CategoryContextType>({
    selectedCategory: undefined,
    setSelectedCategory: (value: ICategory | undefined) => {
        console.log('value: ', value)
    },
    actionWithLeafCategory: undefined,
    setActionWithLeafCategory: (value: string | undefined) => { },
})

export const useCategory = () => useContext(CategoryContext)

interface Props {
    children: React.ReactNode | React.ReactNode[]
}

export const CategoryProvider = ({ children }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>(undefined)
    const [actionWithLeafCategory, setActionWithLeafCategory] = useState<string | undefined>(undefined)

    return <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, actionWithLeafCategory, setActionWithLeafCategory }}>{children}</CategoryContext.Provider>
}
