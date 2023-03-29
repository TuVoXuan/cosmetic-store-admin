import React, { useContext, useState } from 'react'

interface TagContextType {
  selectedTag: ITag | undefined
  setSelectedTag: (value: ITag | undefined) => void
  selectedTagGroup: ISubTagGroup | undefined
  setSelectedTagGroup: (value: ISubTagGroup | undefined) => void
}

export const TagContext = React.createContext<TagContextType>({
  selectedTag: undefined,
  setSelectedTag: (value: ITag | undefined) => {
    console.log('value: ', value)
  },
  selectedTagGroup: undefined,
  setSelectedTagGroup: (value: ISubTagGroup | undefined) => console.log(value)
})

export const useTag = () => useContext(TagContext)

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export const TagProvider = ({ children }: Props) => {
  const [selectedTag, setSelectedTag] = useState<ITag | undefined>(undefined)
  const [selectedTagGroup, setSelectedTagGroup] = useState<ISubTagGroup | undefined>(undefined)

  return (
    <TagContext.Provider value={{ selectedTag, setSelectedTag, setSelectedTagGroup, selectedTagGroup }}>
      {children}
    </TagContext.Provider>
  )
}
