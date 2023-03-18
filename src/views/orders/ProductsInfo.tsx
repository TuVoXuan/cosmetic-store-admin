import React, { Fragment } from 'react'
import { Box, CardContent, CardHeader } from '@mui/material'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { IOrderItem } from '../../types/api/order-api'
import Image from 'next/image'
import { formatPrice } from '../../util/convert'
import Typography from '@mui/material/Typography'

interface Props {
  orderItems: IOrderItem[]
}

export default function ProductsInfo({ orderItems }: Props) {
  return (
    <Card>
      <CardHeader title='Thông tin sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell align='left'>Tên sản phẩm</TableCell>
                <TableCell align='left'>Số lượng</TableCell>
                <TableCell align='center'>Biến thể</TableCell>
                <TableCell align='right'>Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((row: IOrderItem) => (
                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    <Image src={row.thumbnail} alt={row.name} width={100} height={100} />
                  </TableCell>
                  <TableCell align='left'>{row.name}</TableCell>
                  <TableCell align='center'>{row.quantity}</TableCell>
                  <TableCell align='center'>
                    <Box sx={{ display: 'flex' }}>
                      {row.configurations.map((item, index) => (
                        <Fragment key={item}>
                          <Typography variant='subtitle1' key={item}>
                            {item}
                          </Typography>
                          {index < row.configurations.length - 1 && (
                            <Typography sx={{ mx: 1 }} variant='subtitle1'>
                              |
                            </Typography>
                          )}
                        </Fragment>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align='right'>{formatPrice(row.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
