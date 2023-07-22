// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import OrderRevenue from 'src/views/dashboard/OrderRevenue'
import ProtectRoute from '../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import OrderOverview from '../views/dashboard/OrderOverview'
import SellingProducts from '../views/dashboard/sellingProducts'

interface Props {
  auth: string
}

const Dashboard = ({ auth }: Props) => {
  return (
    <ProtectRoute auth={auth}>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={7}>
            <StatisticsCard />
          </Grid>
          <Grid item xs={12} sm={5}>
            <OrderOverview />
          </Grid>
          <Grid item xs={12} md={12}>
            <OrderRevenue />
          </Grid>
          <Grid item xs={12}>
            <SellingProducts />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}

export default Dashboard
