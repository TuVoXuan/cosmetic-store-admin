// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import { Button, Chip, TablePagination, Typography } from '@mui/material'
import productApi from '../../api/product-api'
import toast from 'react-hot-toast'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { removeProductItem, resetProducts, selectProducts } from '../../redux/reducers/product-slice'
import { deleteProduct, getProducts } from '../../redux/actions/product-action'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { useRouter } from 'next/router'
import { IFilterProduct, IProductTable } from '../../types/api/product-api'
import { IFilterProductForm, useFilterProduct } from '../../context/product'
import Link from 'next/link'

const Row = (props: { row: IProductTable }) => {
  // ** Props
  const { row } = props
  const dispatch = useAppDispatch()
  const router = useRouter()

  // ** State
  const [open, setOpen] = useState<boolean>(false)

  const handeDeleteProductItem = (productId: string, itemId: string) => {
    const deleteItem = productApi.deleteProductItem(productId, itemId)
    deleteItem.then(res => {
      dispatch(removeProductItem(res.data.data))
    })
    toast.promise(deleteItem, {
      loading: 'Deleting product item',
      success: 'Delete product item success',
      error: err => ((err as IResponseError).error ? (err as IResponseError).error : 'Error delete product item')
    })
  }

  const handleDeleteProduct = (productId: string) => {
    const deletedProduct = dispatch(deleteProduct(productId)).unwrap()
    toast.promise(deletedProduct, {
      loading: 'Deleting product ...',
      success: 'Delete product success',
      error: err => ((err as IResponseError).error ? (err as IResponseError).error : 'Error delete product')
    })
  }

  const handleAlertDeleteProdItem = (
    productId: string,
    itemId: string,
    productName: string,
    configurations: string[]
  ) => {
    toast.loading(
      t => (
        <Box>
          <p>
            Do want to delete{' '}
            <span style={{ fontWeight: 700 }}>
              {productName} {configurations.join(' ')}
            </span>
            ?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              no
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handeDeleteProductItem(productId, itemId)
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

  const handleAlertDeleteProd = (productId: string, productName: string) => {
    toast.loading(
      t => (
        <Box>
          <p>
            Do want to delete <span style={{ fontWeight: 700 }}>{productName}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              no
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handleDeleteProduct(productId)
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

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.productId}</TableCell>
        <TableCell component='th' scope='row'>
          {row.name}
        </TableCell>
        <TableCell>{row.brand[0].name}</TableCell>
        <TableCell align='right'>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {row.categories.map(category => (
              <Chip key={category._id} label={category.name} />
            ))}
          </Box>
        </TableCell>
        <TableCell align='right'>
          <Box sx={{ display: 'flex', columnGap: 2 }}>
            <IconButton onClick={() => handleAlertDeleteProd(row._id, row.name)} aria-label='delete' color='error'>
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                router.push(`/product/update/${row._id}`)
              }}
              aria-label='delete'
              color='primary'
            >
              <EditIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              {/* <Typography variant='h6' gutterBottom component='div'>
                Product items
              </Typography> */}
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Biến thể</TableCell>
                    <TableCell>Giá tiền</TableCell>
                    <TableCell align='right'>Số lượng</TableCell>
                    <TableCell align='right'>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.productItems.map(item => (
                    <TableRow key={item._id}>
                      <TableCell component='th' scope='row' sx={{ '* + *': { ml: 2 } }}>
                        {item.productConfigurations.map(variant => (
                          <Chip key={variant._id} label={variant.value} />
                        ))}
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell align='right'>{item.quantity}</TableCell>
                      <TableCell align='right'>
                        <IconButton
                          onClick={() =>
                            handleAlertDeleteProdItem(
                              row._id,
                              item._id,
                              row.name,
                              item.productConfigurations.map(item => item.value)
                            )
                          }
                          aria-label='delete'
                          color='error'
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Link passHref href={`/product/update/${row._id}/${item._id}`}>
                          <a>
                            <IconButton
                              // onClick={() => router.push(`/product/update/${row._id}/${item._id}`)}
                              aria-label='delete'
                              color='primary'
                            >
                              <EditIcon />
                            </IconButton>
                          </a>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const TableProduct = () => {
  const dispatch = useAppDispatch()
  const { filter, loading, setLoading } = useFilterProduct()
  const { products, total } = useAppSelector(selectProducts)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleGetProduct = async (page: number, rowsPerPage: number, filter: IFilterProductForm) => {
    setLoading(true)

    const data: IFilterProduct = {
      page: page,
      limit: rowsPerPage
    }

    if (filter.search && filter.type) {
      data.search = filter.search
      data.type = filter.type
    }

    if (filter.brands.length > 0) {
      data.brands = filter.brands.map(item => item.value).join(',')
    }

    if (filter.categories.length > 0) {
      data.category = filter.categories.map(item => item.value).join(',')
    }

    await dispatch(getProducts(data)).unwrap()

    setLoading(false)
  }

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    try {
      if (newPage * rowsPerPage >= products.length) {
        handleGetProduct(newPage, rowsPerPage, filter)
      }
      setPage(newPage)
    } catch (error) {
      toast.error('Không thể lấy dữ liệu bảng sản phẩm')
    }
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    if (products.length === 0) {
      handleGetProduct(page, rowsPerPage, filter)
    }
  }, [])

  useEffect(() => {
    dispatch(resetProducts())
    setPage(0)
    handleGetProduct(0, rowsPerPage, filter)
  }, [filter])

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='Sản phẩm'>
          <colgroup>
            <col width='5%' />
            <col width='10%' />
            <col width='32.5%' />
            <col width='10%' />
            <col width='32.5%' />
            <col width='10%' />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='left'>Mã</TableCell>
              <TableCell align='left'>Tên</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell align='center'>Phân loại</TableCell>
              <TableCell align='center'>hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 &&
              !loading &&
              products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(product => <Row key={product._id} row={product} />)}
          </TableBody>
        </Table>
        {products.length === 0 && !loading && (
          <Typography color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Không sản phẩm
          </Typography>
        )}
        {loading && (
          <Typography color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Đang tải dữ liệu...
          </Typography>
        )}
      </TableContainer>
      <TablePagination
        component='div'
        count={total}
        page={page}
        rowsPerPageOptions={[10, 25]}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default TableProduct
