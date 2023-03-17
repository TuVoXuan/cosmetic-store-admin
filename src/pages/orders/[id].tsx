import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { orderApi } from '../../api/order-api'
import { IOrderDetail } from '../../types/api/order-api'
import Grid from '@mui/material/Grid'
import OrderInfo from '../../views/orders/OrderInfo'
import DeliveryInfo from '../../views/orders/DeliveryInfo'
import ProductsInfo from '../../views/orders/ProductsInfo'

export default function OrderDetail() {
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState<IOrderDetail>()

  const fetchOrder = async () => {
    if (id) {
      const data = await orderApi.getOrderDetail(id as string)

      setOrder(data)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  return (
    <>
      <Grid container spacing={6}>
        {order && (
          <>
            <Grid item xs={6}>
              <OrderInfo
                orderId={order.orderId}
                date={order.date}
                shippingFee={order.shippingFee}
                productValue={order.orderItems.reduce((prev, curr) => prev + curr.price * curr.quantity, 0)}
              />
            </Grid>
            <Grid item xs={6}>
              <DeliveryInfo address={order.address} />
            </Grid>
            <Grid item xs={12}>
              <ProductsInfo orderItems={order.orderItems} />
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}
