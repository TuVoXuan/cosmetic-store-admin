// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import OrderRevenue from 'src/views/dashboard/OrderRevenue'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import ProtectRoute from '../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'
import OrderOverview from '../views/dashboard/OrderOverview'

interface Props {
  auth: string
}

const Dashboard = ({ auth }: Props) => {
  return (
    <ProtectRoute auth={auth}>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <StatisticsCard />
          </Grid>
          <Grid item xs={12} md={5}>
            <OrderOverview />
          </Grid>
          <Grid item xs={12} md={7}>
            <OrderRevenue />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='$25.6k'
                  icon={<Poll />}
                  color='success'
                  trendNumber='+42%'
                  title='Total Profit'
                  subtitle='Weekly Profit'
                />
              </Grid>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='$78'
                  title='Refunds'
                  trend='negative'
                  color='secondary'
                  trendNumber='-15%'
                  subtitle='Past Month'
                  icon={<CurrencyUsd />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <SalesByCountries />
          </Grid>
          <Grid item xs={12}>
            <Table />
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
