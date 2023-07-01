import React from 'react'
import CreateAndUpdateRootCategory from './categoryRootForm'
import CreateAndUpdateLeafCategory from './categoryLeafForm'
import { useCategory } from '../../context/category'

export default function CategoryForm() {
    const { actionWithLeafCategory } = useCategory()

    return <div>{actionWithLeafCategory ? <CreateAndUpdateLeafCategory /> : <CreateAndUpdateRootCategory />}</div>
}
