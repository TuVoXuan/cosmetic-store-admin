import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { orderApi } from '../../api/order-api'
import { OrderStatus } from '../../types/enum'
import { formatDate, formatPrice } from '../../util/convert'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import { useOrders } from '../../context/order'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

interface Props {
  value: OrderStatus
}

export default function TabDelivering({ value }: Props) {
  const { orders, page, rowsPerPage, setOrders, setPage, setRowsPerPage, setTotal, total, fromDate, toDate, filterId } =
    useOrders()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if (newPage * rowsPerPage >= orders.length) {
      setLoading(true)
      const data = await orderApi.getOrders({
        status: value,
        limit: rowsPerPage,
        page: newPage,
        from: fromDate?.toISOString() || '',
        to: toDate?.toISOString() || '',
        id: filterId
      })

      setOrders([...orders, ...data.data])
      setTotal(data.total)
      setLoading(false)
    }
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchOrders = async () => {
    setLoading(true)
    const data = await orderApi.getOrders({
      status: OrderStatus.Delivering,
      page: 0,
      limit: rowsPerPage
    })
    setOrders(data.data)
    setTotal(data.total)
    setLoading(false)
  }

  const handleOnChange = (id: string) => async (event: SelectChangeEvent) => {
    try {
      await orderApi.updateOrderStatus({
        id: id,
        status: event.target.value as OrderStatus
      })
      toast.success('Thay đổi trạng thái đơn hàng thành công.')
      setOrders(orders.filter(item => item._id !== id))
      setTotal(total - 1)
    } catch (error) {
      toast.error((error as IResponseError).error)
    }
  }

  const handleRowClick = (orderId: string) => () => {
    router.push(`/orders/${orderId}`)
  }

  useEffect(() => {
    setOrders([])
    fetchOrders()
  }, [])

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell align='right'>Ngày tạo</TableCell>
              <TableCell align='right'>Giá trị</TableCell>
              <TableCell align='right'>Phương thức thanh toán</TableCell>
              <TableCell align='right'>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 &&
              !loading &&
              orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell
                    onClick={handleRowClick(order.orderId)}
                    sx={{ cursor: 'pointer' }}
                    component='th'
                    scope='row'
                  >
                    {order.orderId}
                  </TableCell>
                  <TableCell onClick={handleRowClick(order.orderId)} sx={{ cursor: 'pointer' }} align='right'>
                    {formatDate(order.date)}
                  </TableCell>
                  <TableCell onClick={handleRowClick(order.orderId)} sx={{ cursor: 'pointer' }} align='right'>
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell onClick={handleRowClick(order.orderId)} sx={{ cursor: 'pointer' }} align='center'>
                    {order.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      id='demo-simple-select'
                      value={OrderStatus.Delivering}
                      onChange={handleOnChange(order._id)}
                    >
                      <MenuItem value={OrderStatus.Delivering}>Đang giao</MenuItem>
                      <MenuItem value={OrderStatus.Completed}>Đã giao</MenuItem>
                      <MenuItem value={OrderStatus.Cancelled}>Đã hủy</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {orders.length === 0 && !loading && (
          <Typography color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Không có đơn hàng
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
