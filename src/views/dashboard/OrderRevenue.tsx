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
import { getOrderRevenueOrRefund, getRevenueOfLastYear } from '../../redux/actions/dashboard-action'
import { Autocomplete, Box, TextField } from '@mui/material'
import categoryApi from '../../api/category-api'

interface Props {
  timeType: string
  onChange: (value: string) => void
}

const RevenueTimeSelect = ({ timeType, onChange }: Props) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string)
  }

  return (
    <FormControl sx={{ width: 200 }}>
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
  const [categories, setCategories] = useState<IOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState<IOption>({ label: 'Tất cả', value: 'All' })

  const { orderRevenueOrRefund } = useAppSelector(selectDashboard)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: false,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: true },
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
    // colors: [theme.palette.primary.main, theme.palette.secondary.main],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      // type: 'category',
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
      if (orderRevenueOrRefund.month.thisYear.length === 0) {
        handleFetchOrderRevenue(timeType, selectedCategory.value)
      }

      if (orderRevenueOrRefund.month.lastYear.length === 0) {
        handleFetchRevenueOfLasYear(selectedCategory.value)
      }
    } else if (timeType === 'week') {
      if (orderRevenueOrRefund.week.revenue.length === 0) {
        handleFetchOrderRevenue(timeType, 'All')
      }
    }
  }

  const handleFetchOrderRevenue = async (timeType: string, categoryId: string) => {
    await dispatch(getOrderRevenueOrRefund({ timeReport: timeType, categoryId: categoryId }))
  }

  const handleFetchRevenueOfLasYear = async (categoryId: string) => {
    await dispatch(getRevenueOfLastYear(categoryId)).unwrap()
  }

  const handleSelectChange = (value: IOption) => {
    setSelectedCategory(value)
  }

  const handleGetCategories = async () => {
    try {
      const res = await categoryApi.getCategoryLeaf()
      const options: IOption[] = res.data.data.map(item => {
        let option: IOption = { value: '', label: '' }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id
            }
          }
        }

        return option
      })

      options.unshift({ label: 'Tất cả', value: 'All' })

      setCategories(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  useEffect(() => {
    if (timeType === 'month') {
      handleFetchRevenueOfLasYear(selectedCategory.value)
    }
    handleFetchOrderRevenue(timeType, selectedCategory.value)
    handleGetCategories()
  }, [])

  useEffect(() => {
    let revenue: IChartData[] = []
    let lastYear: IChartData[] = []

    if (timeType === 'month') {
      revenue = orderRevenueOrRefund.month.thisYear.map(item => ({ x: item.label, y: item.value }))
      lastYear = orderRevenueOrRefund.month.lastYear.map(item => ({ x: item.label, y: item.value }))
      setChartDataRefund(lastYear)
    } else if (timeType === 'week') {
      revenue = orderRevenueOrRefund.week.revenue.map(item => ({ x: item.label, y: item.value }))
    }
    setChartDataRevenue(revenue)
  }, [timeType, orderRevenueOrRefund])

  useEffect(() => {
    handleFetchOrderRevenue(timeType, selectedCategory.value)
    handleFetchRevenueOfLasYear(selectedCategory.value)
  }, [selectedCategory])

  return (
    <Card>
      <CardHeader
        title='Biểu đồ doanh thu'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <Box sx={{ display: 'flex', columnGap: 4 }}>
            <FormControl sx={{ width: 300 }}>
              {timeType === 'month' && (
                <Autocomplete
                  disablePortal
                  id='category'
                  options={categories}
                  value={selectedCategory}
                  sx={{ width: '100%' }}
                  renderInput={params => <TextField {...params} label='Danh mục' />}
                  onChange={(e, value) => {
                    if (value) {
                      handleSelectChange(value)
                    }

                    return value
                  }}
                />
              )}
            </FormControl>
            <RevenueTimeSelect onChange={handleChangeTimeType} timeType={timeType} />
          </Box>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        {chartDataRefund.length > 0 && chartDataRevenue.length > 0 && (
          <ReactApexcharts
            type='bar'
            height={205}
            options={options}
            series={
              timeType === 'month'
                ? [
                  { name: 'Năm nay', data: chartDataRevenue, color: theme.palette.primary.main },
                  { name: 'Năm trước', data: chartDataRefund, color: theme.palette.warning.main }
                ]
                : [{ name: 'Doanh thu', data: chartDataRevenue, color: theme.palette.primary.main }]
            }
          />
        )}
      </CardContent>
    </Card>
  )
}

export default OrderRevenue
