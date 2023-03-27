// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import ProtectRoute from '../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import TableProduct from '../../views/product/TableProduct'

interface Props {
  auth: string
}

const Product = ({ auth }: Props) => {
  const router = useRouter()

  return (
    <ProtectRoute auth={auth}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardHeader title='Products' titleTypographyProps={{ variant: 'h6' }} />
              <Button
                onClick={() => router.push('/product/create')}
                size='medium'
                variant='contained'
                type='submit'
                sx={{ mr: 5 }}
              >
                Create
              </Button>
            </Box>
            <TableProduct />
          </Card>
        </Grid>
        {/* <AlertDialogModal open={openDeleteModel} onClose={handleCloseModal} /> */}
      </Grid>
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}

export default Product
