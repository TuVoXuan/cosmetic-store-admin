import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { formatDate, formatPrice } from '../../util/convert'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'

interface Props {
  orderId: string
  date: string
  shippingFee: number
  productValue: number
  status: string
}

export default function OrderInfo({ orderId, date, shippingFee, productValue, status }: Props) {
  return (
    <Card>
      <CardHeader title={'Thông tin đơn hàng'} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography color='text.secondary'>Mã đơn hàng</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {orderId}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary'>Ngày tạo</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {formatDate(date)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary'>Trạng thái</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {status}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider variant='middle' />
          </Grid>

          <Grid item xs={6}>
            <Typography color='text.secondary'>Tổng giá trị sản phẩm</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {formatPrice(productValue)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary'>Phí giao hàng</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {formatPrice(shippingFee)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary'>Tổng đơn hàng</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {formatPrice(shippingFee + productValue)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
