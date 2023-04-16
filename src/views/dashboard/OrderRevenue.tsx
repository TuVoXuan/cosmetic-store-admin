import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectDashboard } from '../../redux/reducers/dashboard-slice'
import { getOrderRevenueOrRefund } from '../../redux/actions/dashboard-action'

interface Props {
  timeType: string
  onChange: (value: string) => void
}

const RevenueTimeSelect = ({ timeType, onChange }: Props) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string)
  }

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id='demo-simple-select-label'>Thời gian</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={timeType}
        label='Thời gian'
        onChange={handleChange}
      >
        <MenuItem value={'month'}>Tháng</MenuItem>
        <MenuItem value={'week'}>Tuần</MenuItem>
      </Select>
    </FormControl>
  )
}

const OrderRevenue = () => {
  // ** Hook
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [timeType, setTimeType] = useState('month')
  const [chartDataRevenue, setChartDataRevenue] = useState<IChartData[]>([])
  const [chartDataRefund, setChartDataRefund] = useState<IChartData[]>([])

  const { orderRevenueOrRefund } = useAppSelector(selectDashboard)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: chartDataRevenue.map(item => theme.palette.primary.main),
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      type: 'category',
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }

  const handleChangeTimeType = (timeType: string) => {
    setTimeType(timeType)
    if (timeType === 'month') {
      if (orderRevenueOrRefund.month.refund.length === 0) {
        handleFetchOrderRevenue(timeType, 'notAcceptOrder')
      }
      if (orderRevenueOrRefund.month.refund.length === 0) {
        handleFetchOrderRevenue(timeType, 'completed')
      }
    } else if (timeType === 'week') {
      console.log('vo')
      if (orderRevenueOrRefund.week.refund.length === 0) {
        handleFetchOrderRevenue(timeType, 'notAcceptOrder')
      }
      if (orderRevenueOrRefund.week.refund.length === 0) {
        handleFetchOrderRevenue(timeType, 'completed')
      }
    }
  }

  const handleFetchOrderRevenue = async (timeType: string, status: string) => {
    await dispatch(getOrderRevenueOrRefund({ status, timeReport: timeType }))
  }

  useEffect(() => {
    handleFetchOrderRevenue(timeType, 'completed')
    handleFetchOrderRevenue(timeType, 'notAcceptOrder')
  }, [])

  useEffect(() => {
    let revenue: IChartData[] = []
    let refund: IChartData[] = []

    if (timeType === 'month') {
      revenue = orderRevenueOrRefund.month.revenue.map(item => ({ x: item.label, y: item.value }))
      refund = orderRevenueOrRefund.month.refund.map(item => ({ x: item.label, y: item.value }))
    } else if (timeType === 'week') {
      revenue = orderRevenueOrRefund.week.revenue.map(item => ({ x: item.label, y: item.value }))
      refund = orderRevenueOrRefund.week.refund.map(item => ({ x: item.label, y: item.value }))
    }
    setChartDataRevenue(revenue)
    setChartDataRefund(refund)
  }, [timeType, orderRevenueOrRefund])

  return (
    <Card>
      <CardHeader
        title='Biểu đồ doanh thu'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={<RevenueTimeSelect onChange={handleChangeTimeType} timeType={timeType} />}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        {chartDataRefund.length > 0 && chartDataRevenue.length > 0 && (
          <ReactApexcharts
            type='bar'
            height={205}
            options={options}
            series={[
              { name: 'Doanh thu', data: chartDataRevenue },
              { name: 'Hoàn tiền', data: chartDataRefund }
            ]}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default OrderRevenue
