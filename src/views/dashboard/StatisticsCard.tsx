// ** React Imports
import { ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import Archive from 'mdi-material-ui/Archive'
import ArchiveCancel from 'mdi-material-ui/ArchiveCancel'
import ArchiveCheck from 'mdi-material-ui/ArchiveCheck'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectDashboard } from '../../redux/reducers/dashboard-slice'
import { toast } from 'react-hot-toast'
import { getOrderDailyReport } from '../../redux/actions/dashboard-action'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const StatisticsCard = () => {
  const dispatch = useAppDispatch()
  const { dailyReport } = useAppSelector(selectDashboard)

  const handleFetchDailyReport = async () => {
    try {
      await dispatch(getOrderDailyReport())
    } catch (error) {
      toast.error((error as IResponseError).error)
    }
  }

  useEffect(() => {
    handleFetchDailyReport()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Thống kê trong ngày'
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: 'info.main'
                }}
              >
                <Archive sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Số đơn hàng</Typography>
                <Typography variant='h6'>{dailyReport.numOfOrders}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: 'error.main'
                }}
              >
                <ArchiveCancel sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Số đơn hàng bị hủy</Typography>
                <Typography variant='h6'>{dailyReport.numOfCancelledOrders}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: 'success.main'
                }}
              >
                <ArchiveCheck sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Số đơn hàng thành công</Typography>
                <Typography variant='h6'>{dailyReport.numOfCompletedOrders}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: 'success.main'
                }}
              >
                <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Doanh thu</Typography>
                <Typography variant='h6'>{dailyReport.totalRevenueToday / 1000}k</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
