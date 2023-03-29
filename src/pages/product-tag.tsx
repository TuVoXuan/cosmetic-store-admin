import { Grid } from '@mui/material'
import { getCookie } from 'cookies-next'
import React from 'react'
import { TagProvider } from '../context/tag'
import ProtectRoute from '../layouts/components/ProtectRoute'
import ProductTagForm from '../views/product-tag/productTagForm'
import ProductTagGroupForm from '../views/product-tag/productTagGroupForm'
import ProductTagTable from '../views/product-tag/productTagTable'

interface Props {
  auth: string
}

export default function ProductTag({ auth }: Props) {
  return (
    <ProtectRoute auth={auth}>
      <TagProvider>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProductTagTable />
          </Grid>
          <Grid item xs={12}>
            <ProductTagGroupForm />
          </Grid>
          <Grid item xs={12}>
            <ProductTagForm />
          </Grid>
        </Grid>
      </TagProvider>
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}
