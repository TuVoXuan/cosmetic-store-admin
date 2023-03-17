import React, { useContext, useState } from 'react'
import { IOrderTable } from '../types/api/order-api'

interface OrderContextType {
  orders: IOrderTable[]
  setOrders: (value: IOrderTable[]) => void
  page: number
  setPage: (value: number) => void
  rowsPerPage: number
  setRowsPerPage: (value: number) => void
  total: number
  setTotal: (value: number) => void
  fromDate: Date | null | undefined
  setFromDate: (value: Date | null | undefined) => void
  toDate: Date | null | undefined
  setToDate: (value: Date | null | undefined) => void
  filterId: string
  setFilterId: (value: string) => void
}

export const OrderContext = React.createContext<OrderContextType>({
  orders: [],
  setOrders: (value: IOrderTable[]) => {
    console.log('value: ', value)
  },
  page: 0,
  setPage: (value: number) => {
    console.log('value: ', value)
  },
  rowsPerPage: 10,
  setRowsPerPage: (value: number) => {
    console.log('value: ', value)
  },
  total: 0,
  setTotal: (value: number) => {
    console.log('value: ', value)
  },
  fromDate: undefined,
  setFromDate: (value: Date | null | undefined) => {
    console.log('value: ', value)
  },
  toDate: undefined,
  setToDate: (value: Date | null | undefined) => {
    console.log('value: ', value)
  },
  filterId: '',
  setFilterId: (value: string) => {
    console.log('value: ', value)
  }
})

export const useOrders = () => useContext(OrderContext)

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

export const OrderProvider = ({ children }: Props) => {
  const [orders, setOrders] = useState<IOrderTable[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [fromDate, setFromDate] = useState<Date | null | undefined>(null)
  const [toDate, setToDate] = useState<Date | null | undefined>(null)
  const [filterId, setFilterId] = useState('')

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        setTotal,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        filterId,
        setFilterId
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
