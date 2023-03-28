import React, { ChangeEventHandler, Fragment, useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Grid, IconButton, TablePagination, TextField } from '@mui/material'
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
import { Controller, useForm } from 'react-hook-form'

interface FormValue {
  search: string
}

export default function BrandTable() {
  const dispatch = useAppDispatch()
  const brands = useAppSelector(selectBrands).brands
  const { setSelectedBrand } = useBrand()
  const { reset, control, handleSubmit } = useForm<FormValue>()

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [filterBrands, setFilterBrands] = useState<IBrand[]>(brands)
  const [searchValue, setSearchValue] = useState<string>('')

  const fetchBrands = async () => {
    try {
      const response = await dispatch(getBrands()).unwrap()
      setFilterBrands(response)
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
            Bạn có muốn xóa <span style={{ fontWeight: 700 }}>{brand.name}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              Không
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
              Có
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

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDelete = async (id: string) => {
    const deleteResult = dispatch(deleteBrand(id)).unwrap()

    toast.promise(deleteResult, {
      loading: 'Đang xóa thương hiệu ...',
      success: 'Xóa thương hiệu thành công',
      error: 'Đã xảy ra lỗi'
    })
  }

  const onSubmit = (value: FormValue) => {
    const searchKey = value.search
    const filter = filterBrands.filter(brand => brand.name.toLowerCase().includes(searchKey.toLowerCase()))
    setFilterBrands(filter)
  }

  const hanldeResetForm = () => {
    setFilterBrands(brands)
  }

  useEffect(() => {
    reset()
    fetchBrands()
  }, [])

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={'Bộ lọc'} titleTypographyProps={{ variant: 'h5' }} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name={'search'}
                    defaultValue={''}
                    rules={{ required: { value: true, message: 'Yêu cầu nhập nội dung tìm kiếm' } }}
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <TextField
                        error={invalid}
                        helperText={error?.message}
                        fullWidth
                        label='Tìm kiếm'
                        placeholder='Tên thương hiệu'
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-end' }}>
                  <Button type='submit' sx={{ marginLeft: 4 }} variant='contained'>
                    Tìm kiếm
                  </Button>
                  <Button
                    onClick={hanldeResetForm}
                    type='button'
                    sx={{ marginLeft: 4 }}
                    color='secondary'
                    variant='contained'
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardHeader title={'Thương hiệu'} titleTypographyProps={{ variant: 'h5' }} />
            <Button onClick={() => setSelectedBrand(undefined)} sx={{ mr: 5 }} variant='contained'>
              Thêm thương hiệu
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='simple table'>
              <colgroup>
                <col width='33.3333%' />
                <col width='33.3333%' />
                <col width='33.3333%' />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Tên thương hiệu</TableCell>
                  <TableCell align='center'>Logo</TableCell>
                  <TableCell align='right'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterBrands.length > 0 &&
                  filterBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(brand => (
                    <TableRow key={brand._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component='th' scope='row'>
                        {brand.name}
                      </TableCell>
                      <TableCell align='center'>
                        <img src={brand.logo} alt={brand.name} style={{ maxHeight: 50, maxWidth: 200 }} />
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
          <TablePagination
            component='div'
            count={filterBrands.length}
            page={page}
            rowsPerPageOptions={[10, 25]}
            onPageChange={handleChangePage}
            rowsPerPage={10}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Grid>
    </Grid>
  )
}
