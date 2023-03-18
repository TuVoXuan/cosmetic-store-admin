import React from 'react'
import Grid from '@mui/material/Grid'
import BrandTable from '../views/brand/brandTable'
import CreateBrandForm from '../views/brand/createAndUpdateBrandForm'
import { BrandProvider } from '../context/brand'
import ProtectRoute from '../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'

interface Props {
  auth: string
}

export default function Brand({ auth }: Props) {
  return (
    <ProtectRoute auth={auth}>
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
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}
