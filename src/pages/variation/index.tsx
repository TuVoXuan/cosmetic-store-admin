import React from 'react'
import Grid from '@mui/material/Grid'
import VariantTable from '../../views/variation/variantTable'
import CreateVariationForm from '../../views/variation/createVariationForm'

export default function Variation() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <VariantTable />
      </Grid>
      <Grid item xs={12}>
        <CreateVariationForm />
      </Grid>
    </Grid>
  )
}
