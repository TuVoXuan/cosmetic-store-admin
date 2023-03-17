import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { IAddress } from '../../types/api/order-api'

interface Props {
  address: IAddress
}

export default function DeliveryInfo({ address }: Props) {
  const { name, phone, specificAddress, ward, district, province } = address

  return (
    <Card>
      <CardHeader title='Thông tin nhận hàng' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography color='text.secondary'>Người nhận</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color='text.secondary'>Số điện thoại</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} align='right' variant='subtitle1'>
              {phone}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color='text.secondary'>Địa chỉ nhận hàng</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color='text.secondary' sx={{ fontWeight: 500 }} variant='subtitle1'>
              {`${specificAddress}, ${ward}, ${district}, ${province}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
