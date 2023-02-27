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
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import { Button, Chip } from '@mui/material'
import productApi from '../../api/product-api'
import toast from 'react-hot-toast'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { removeProductItem, selectProducts } from '../../redux/reducers/product-slice'
import { deleteProduct, getProducts } from '../../redux/actions/product-action'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'

const Row = (props: { row: IProductTable }) => {
  // ** Props
  const { row } = props
  const dispatch = useAppDispatch()

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
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.name}
        </TableCell>
        <TableCell>{row.brand[0].name}</TableCell>
        <TableCell align='right' sx={{ '* + *': { ml: 2 } }}>
          {row.categories.map(category => (
            <Chip key={category._id} label={category.name} />
          ))}
        </TableCell>
        <TableCell align='right' sx={{ display: 'flex', columnGap: 2 }}>
          <IconButton onClick={() => handleAlertDeleteProd(row._id, row.name)} aria-label='delete' color='error'>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label='delete' color='primary'>
            <EditIcon />
          </IconButton>
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
                    <TableCell>Variations</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                    <TableCell align='right'>Sale</TableCell>
                    <TableCell align='right'>Actions</TableCell>
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
                      <TableCell align='right'>{'10%'}</TableCell>
                      <TableCell align='right' sx={{ display: 'flex', columnGap: 2 }}>
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
                        <IconButton aria-label='delete' color='primary'>
                          <EditIcon />
                        </IconButton>
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

const TableCollapsible = () => {
  //   const [products, setProducts] = useState<IProductTable[]>()
  const dispatch = useAppDispatch()
  const { products } = useAppSelector(selectProducts)

  const handleGetProduct = async () => {
    if (products.length === 0) {
      await dispatch(getProducts()).unwrap()
    }
  }

  useEffect(() => {
    handleGetProduct()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table aria-label='Products'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell align='right'>Category</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{products && products.map(product => <Row key={product._id} row={product} />)}</TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
