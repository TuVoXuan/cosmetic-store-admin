// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableCollapsible from 'src/views/tables/TableCollapsible'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'

const Product = () => {
  const router = useRouter()

  return (
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
          <TableCollapsible />
        </Card>
      </Grid>
      {/* <AlertDialogModal open={openDeleteModel} onClose={handleCloseModal} /> */}
    </Grid>
  )
}

export default Product
