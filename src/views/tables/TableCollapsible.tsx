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
import { Chip, Fab } from '@mui/material'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import productApi from '../../api/product-api'

const Row = (props: { row: IProductTable }) => {
  // ** Props
  const { row } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)

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
          {row.cagetories.map(category => (
            <Chip key={category._id} label={category.name} />
          ))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Product items
              </Typography>
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
                      <TableCell align='right'>{100}</TableCell>
                      <TableCell align='right'>{'10%'}</TableCell>
                      <TableCell align='right' sx={{ display: 'flex', columnGap: 2 }}>
                        <Fab color='primary' size='small' aria-label='edit'>
                          <EditIcon />
                        </Fab>
                        <Fab color='error' size='small' aria-label='delete'>
                          <DeleteIcon />
                        </Fab>
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
  const [products, setProducts] = useState<IProductTable[]>()

  useEffect(() => {
    productApi
      .getProductTable()
      .then(data => setProducts(data.data.data))
      .catch(error => console.log('error: ', error))
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
          </TableRow>
        </TableHead>
        <TableBody>{products && products.map(product => <Row key={product._id} row={product} />)}</TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
