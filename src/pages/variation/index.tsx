import React, { useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import VariantTable from '../../views/variation/variantTable'
import CreateVariationForm from '../../views/variation/createVariationForm'
import { VariationProvider } from '../../context/variation'
import AddOptionsForm from '../../views/variation/addOptionForm'
import ProtectRoute from '../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'

interface Props {
  auth: string
}

export default function Variation({ auth }: Props) {
  const [tab, setTab] = useState<'create' | 'add-options' | 'update'>('create')
  const CreateFormRef = useRef<HTMLDivElement>(null)
  const AddOptionsFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    switch (tab) {
      case 'create':
        if (CreateFormRef.current) {
          CreateFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        break
      case 'add-options':
        if (AddOptionsFormRef.current) {
          AddOptionsFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      default:
        break
    }
  }, [tab])

  return (
    <ProtectRoute auth={auth}>
      <VariationProvider setTab={setTab}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <VariantTable />
          </Grid>
          {tab === 'create' && (
            <Grid ref={CreateFormRef} item xs={12}>
              <CreateVariationForm />
            </Grid>
          )}
          {tab === 'add-options' && (
            <Grid ref={AddOptionsFormRef} item xs={12}>
              <AddOptionsForm />
            </Grid>
          )}
        </Grid>
      </VariationProvider>
    </ProtectRoute>
  )
}
export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}
