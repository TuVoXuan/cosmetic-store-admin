import { Grid } from '@mui/material'
import React from 'react'
import { TagProvider } from '../context/tag'
import ProductTagForm from '../views/product-tag/productTagForm'
import ProductTagTable from '../views/product-tag/productTagTable'

export default function ProductTag() {
  return (
    <TagProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProductTagTable />
        </Grid>
        <Grid item xs={12}>
          <ProductTagForm />
        </Grid>
      </Grid>
    </TagProvider>
  )
}
