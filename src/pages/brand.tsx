import React from 'react'
import Grid from '@mui/material/Grid'
import BrandTable from '../views/brand/brandTable'
import CreateBrandForm from '../views/brand/createAndUpdateBrandForm'
import { BrandProvider } from '../context/brand'

export default function Brand() {
  return (
    <BrandProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BrandTable />
        </Grid>
        <Grid item xs={12}>
          <CreateBrandForm />
        </Grid>
      </Grid>
    </BrandProvider>
  )
}
