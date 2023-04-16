import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectDashboard } from '../../redux/reducers/dashboard-slice'
import { getOrderOverview, getOrderRevenueOrRefund } from '../../redux/actions/dashboard-action'

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

const OrderOverview = () => {
  // ** Hook
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [timeType, setTimeType] = useState('month')
  const [chartData, setChartDate] = useState<number[]>([])
  const { orderOverview } = useAppSelector(selectDashboard)

  const options: ApexOptions = {
    labels: ['Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy', 'Không nhận hàng'],
    legend: {
      show: true,
      position: 'bottom'
    }
  }

  const handleChangeTimeType = (value: string) => {
    setTimeType(value)
    if (value === 'month') {
      if (orderOverview.month.length === 0) {
        handleFetchOrderOverview(value)
      }
    } else if (value === 'week') {
      if (orderOverview.week.length === 0) {
        handleFetchOrderOverview(value)
      }
    }
  }

  const handleFetchOrderOverview = async (value: string) => {
    await dispatch(getOrderOverview(value))
  }

  useEffect(() => {
    handleFetchOrderOverview(timeType)
  }, [])

  useEffect(() => {
    let data: number[] = []
    if (timeType === 'month') {
      data = orderOverview.month.map(item => item.count)
    } else if (timeType === 'week') {
      data = orderOverview.week.map(item => item.count)
    }
    setChartDate(data)
  }, [timeType, orderOverview])

  return (
    <Card>
      <CardHeader
        title='Tổng quan'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={<RevenueTimeSelect onChange={handleChangeTimeType} timeType={timeType} />}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='pie' options={options} series={chartData} />
      </CardContent>
    </Card>
  )
}

export default OrderOverview
