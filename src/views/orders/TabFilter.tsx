import React, { forwardRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import DatePicker from 'react-datepicker'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import DatePickerWrapper from '../../@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from '@mui/material/Button'
import { useOrders } from '../../context/order'
import { orderApi } from '../../api/order-api'
import { OrderStatus } from '../../types/enum'
import Box from '@mui/material/Box'
import { toast } from 'react-hot-toast'

interface Props {
  value: OrderStatus
}

interface CustomInputProps {
  children?: React.ReactNode
  label?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  return <TextField inputRef={ref} fullWidth {...props} />
})

export default function TabFilter({ value }: Props) {
  const { setOrders, setTotal, rowsPerPage, fromDate, setFromDate, toDate, setToDate, filterId, setFilterId } =
    useOrders()

  const [loading, setLoading] = useState(false)

  const handleFilter = async () => {
    try {
      setLoading(true)
      const data = await orderApi.getOrders({
        status: value,
        limit: rowsPerPage,
        page: 0,
        from: fromDate?.toISOString() || '',
        to: toDate?.toISOString() || '',
        id: filterId
      })
      setLoading(false)
      setOrders(data.data)
      setTotal(data.total)
    } catch (error) {
      setLoading(false)
      toast.error((error as IResponseError).error)
    }
  }

  const handleReset = () => {
    setFromDate(null)
    setToDate(null)
    setFilterId('')
  }

  return (
    <Card>
      <CardHeader title='Bộ lọc' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={fromDate}
                  showYearDropdown
                  showMonthDropdown
                  placeholderText='MM-DD-YYYY'
                  customInput={<CustomInput label='Đến ngày' />}
                  onChange={(date: Date) => setFromDate(date)}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={toDate}
                  showYearDropdown
                  showMonthDropdown
                  placeholderText='MM-DD-YYYY'
                  customInput={<CustomInput label='Đến ngày' />}
                  onChange={(date: Date) => setToDate(date)}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={filterId}
                label='Mã đơn hàng'
                onChange={e => setFilterId(e.target.value)}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Box>
                <Button variant='contained' color='secondary' onClick={handleReset}>
                  Reset
                </Button>
                <Button sx={{ marginLeft: 4 }} variant='contained' onClick={handleFilter} disabled={loading}>
                  {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
