import React, { useEffect } from 'react'
import { Button, Card, CardHeader, IconButton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectBrands } from '../../redux/reducers/brand-slice'
import { deleteBrand, getBrands } from '../../redux/actions/brand-action'
import { toast } from 'react-hot-toast'
import EditIcon from '@mui/icons-material/Edit'
import { useBrand } from '../../context/brand'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

export default function BrandTable() {
  const dispatch = useAppDispatch()
  const brands = useAppSelector(selectBrands).brands
  const { setSelectedBrand } = useBrand()

  const fetchBrands = async () => {
    try {
      await dispatch(getBrands()).unwrap()
    } catch (error) {
      toast.error((error as IResponseError).error)
    }
  }

  const handleShowFormUpdate = (brand: IBrand) => () => {
    setSelectedBrand(brand)
  }

  const handleConfirmDeleteOption = (brand: IBrand) => () => {
    toast.loading(
      t => (
        <Box>
          <p>
            Do want to delete <span style={{ fontWeight: 700 }}>{brand.name}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              no
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handleDelete(brand._id)
              }}
              type='button'
              color='error'
              variant='contained'
            >
              Yes
            </Button>
          </Box>
        </Box>
      ),
      {
        id: 'warningToast',
        style: { maxWidth: '500px' },
        icon: <WarningRoundedIcon color='error' />
      }
    )
  }

  const handleDelete = async (id: string) => {
    const deleteResult = dispatch(deleteBrand(id)).unwrap()

    toast.promise(deleteResult, {
      loading: 'Deleting brand ...',
      success: 'Delete brand success',
      error: 'Error delete brand'
    })
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader title={'Brands'} titleTypographyProps={{ variant: 'h5' }} />
        <Button onClick={() => setSelectedBrand(undefined)} sx={{ mr: 5 }} variant='contained'>
          Add Brand
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <colgroup>
            <col width='33.3333%' />
            <col width='33.3333%' />
            <col width='33.3333%' />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='center'>Logo</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.length > 0 &&
              brands.map(brand => (
                <TableRow key={brand._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {brand.name}
                  </TableCell>
                  <TableCell align='center'>
                    <img src={brand.logo} alt={brand.name} style={{ width: 200 }} />
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={handleShowFormUpdate(brand)} aria-label='delete' color='primary'>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleConfirmDeleteOption(brand)} color='error' aria-label='add an alarm'>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
