import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectUser } from '../../redux/reducers/user-slice'
import { getInfo } from '../../redux/actions/user-action'
import { toast } from 'react-hot-toast'

interface Props {
  children: React.ReactNode | React.ReactNode[]
  auth: string
}

export default function ProtectRoute({ children, auth }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const fetchUserInfo = async () => {
    try {
      await dispatch(getInfo()).unwrap()
    } catch (error) {
      console.log('error: ', error)
      toast.error('Đã xảy ra lỗi khi lấy thông tin người dùng')
    }
  }

  useEffect(() => {
    if (!auth) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    if (auth && user && !user._id) {
      fetchUserInfo()
    }
  }, [user])

  if (!auth) {
    return (
      <Container
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant='h2' color='text.primary'>
          401
        </Typography>
        <Typography variant='h6' color='text.primary'>
          Bạn không có quyền truy cập vào trang web này!
        </Typography>
      </Container>
    )
  }

  return <>{children}</>
}
