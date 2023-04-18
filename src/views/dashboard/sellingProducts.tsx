import {
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectDashboard } from '../../redux/reducers/dashboard-slice'
import { getSellingProduct } from '../../redux/actions/dashboard-action'

interface Props {
  timeType: string
  onChange: (value: string) => void
}

const TimeTypeSelect = ({ timeType, onChange }: Props) => {
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
        <MenuItem value={'week'}>7 ngày gần đây</MenuItem>
        <MenuItem value={'month'}>Tháng này</MenuItem>
      </Select>
    </FormControl>
  )
}

export default function SellingProducts() {
  const sellingProducts = useAppSelector(selectDashboard).sellingProducts
  const dispatch = useAppDispatch()
  const [timeType, setTimeType] = useState<'week' | 'month'>('week')

  const handleChange = (value: string) => {
    setTimeType(value as 'week' | 'month')
    if (
      (value === 'week' && sellingProducts.week.length === 0) ||
      (value === 'month' && sellingProducts.month.length === 0)
    ) {
      dispatch(
        getSellingProduct({
          limit: 10,
          timeType: value as 'week' | 'month'
        })
      ).unwrap()
    }
  }

  useEffect(() => {
    if (sellingProducts.month.length === 0 && sellingProducts.week.length === 0) {
      dispatch(
        getSellingProduct({
          limit: 10,
          timeType: 'week'
        })
      ).unwrap()
    }
  }, [])

  return (
    <Card>
      <CardHeader
        title={'Sản phẩm bán chạy'}
        titleTypographyProps={{ variant: 'h6' }}
        action={<TimeTypeSelect onChange={handleChange} timeType={timeType} />}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell align='right'>Đã bán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeType === 'month'
              ? sellingProducts.month.length > 0 &&
                sellingProducts.month.map(item => (
                  <TableRow key={item.itemId}>
                    <TableCell>
                      <Image src={item.thumbnail} alt={item.name} width={100} height={100} objectFit='contain' />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align='right'>{item.sold}</TableCell>
                  </TableRow>
                ))
              : sellingProducts.week.length > 0 &&
                sellingProducts.week.map(item => (
                  <TableRow key={item.itemId}>
                    <TableCell>
                      <Image src={item.thumbnail} alt={item.name} width={100} height={100} objectFit='contain' />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align='right'>{item.sold}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
