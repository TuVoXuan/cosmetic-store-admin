import { Grid } from '@mui/material'
import { getCookie } from 'cookies-next'
import React from 'react'
import ProtectRoute from '../layouts/components/ProtectRoute'
import CategoryTree from '../views/category/categoryTree'
import { CategoryProvider } from '../context/category'
import CategoryForm from '../views/category/categoryForm'

interface Props {
    auth: string
}

export default function Categori({ auth }: Props) {
    return (
        <ProtectRoute auth={auth}>
            <CategoryProvider>
                <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                        <CategoryTree />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CategoryForm />
                    </Grid>
                </Grid>
            </CategoryProvider>
        </ProtectRoute >
    )
}

export const getServerSideProps = ({ req, res }: any) => {
    const auth = getCookie('Authorization', { req, res }) || ''

    return { props: { auth: auth } }
}