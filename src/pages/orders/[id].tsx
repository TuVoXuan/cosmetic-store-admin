import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { orderApi } from '../../api/order-api'
import { IOrderDetail } from '../../types/api/order-api'
import Grid from '@mui/material/Grid'
import OrderInfo from '../../views/orders/OrderInfo'
import DeliveryInfo from '../../views/orders/DeliveryInfo'
import ProductsInfo from '../../views/orders/ProductsInfo'
import { translateOrderStatus } from '../../util/convert'
import ProtectRoute from '../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import { toast } from 'react-hot-toast'

interface Props {
  auth: string
}

export default function OrderDetail({ auth }: Props) {
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState<IOrderDetail>()

  const fetchOrder = async () => {
    if (id) {
      try {
        const data = await orderApi.getOrderDetail(id as string)

        setOrder(data)
      } catch (error) {
        toast.error('Không thể lấy thông tin đơn hàng')
      }
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  return (
    <ProtectRoute auth={auth}>
      <Grid container spacing={6}>
        {order && (
          <>
            <Grid item xs={6}>
              <OrderInfo
                orderId={order.orderId}
                date={order.date}
                shippingFee={order.shippingFee}
                status={translateOrderStatus(order.status)}
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
    </ProtectRoute>
  )
}
export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}
