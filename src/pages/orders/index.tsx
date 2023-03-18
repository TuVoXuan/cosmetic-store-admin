import React, { SyntheticEvent, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { OrderStatus } from '../../types/enum'
import TabPending from '../../views/orders/TabPending'
import TabDelivering from '../../views/orders/TabDelivering'
import TabCompleted from '../../views/orders/TabCompleted'
import Grid from '@mui/material/Grid'
import 'react-datepicker/dist/react-datepicker.css'
import TabCancelled from '../../views/orders/TabCancelled'
import { OrderProvider } from '../../context/order'
import TabFilter from '../../views/orders/TabFilter'
import TabNotAcceptOrder from '../../views/orders/TabNotAcceptOrder'
import ProtectRoute from '../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

interface Props {
  auth: string
}

export default function Orders({ auth }: Props) {
  const [value, setValue] = useState<OrderStatus>(OrderStatus.Pending)

  const handleChange = (event: SyntheticEvent, newValue: OrderStatus.Pending) => {
    setValue(newValue)
  }

  return (
    <ProtectRoute auth={auth}>
      <OrderProvider>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TabFilter value={value} />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Đơn hàng' titleTypographyProps={{ variant: 'h6' }} />
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  aria-label='account-settings tabs'
                  sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                  <Tab value={OrderStatus.Pending} label={<TabName>Đang xử lý</TabName>} />
                  <Tab value={OrderStatus.Delivering} label={<TabName>Đang giao hàng</TabName>} />
                  <Tab value={OrderStatus.Completed} label={<TabName>Đã giao hàng</TabName>} />
                  <Tab value={OrderStatus.Cancelled} label={<TabName>Đã hủy</TabName>} />
                  <Tab value={OrderStatus.NotAcceptOrder} label={<TabName>Không nhận hàng</TabName>} />
                </TabList>

                <TabPanel sx={{ p: 0 }} value={OrderStatus.Pending}>
                  <TabPending value={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={OrderStatus.Delivering}>
                  <TabDelivering value={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={OrderStatus.Completed}>
                  <TabCompleted value={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={OrderStatus.Cancelled}>
                  <TabCancelled value={value} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={OrderStatus.NotAcceptOrder}>
                  <TabNotAcceptOrder value={value} />
                </TabPanel>
              </TabContext>
            </Card>
          </Grid>
        </Grid>
      </OrderProvider>
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}
