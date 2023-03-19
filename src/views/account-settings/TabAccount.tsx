// ** React Imports
import { useState, useMemo, useEffect, forwardRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

// ** Icons Imports
import { Controller, useForm } from 'react-hook-form'
import { Gender } from '../../types/enum'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { selectUser } from '../../redux/reducers/user-slice'
import FormHelperText from '@mui/material/FormHelperText'
import DatePickerWrapper from '../../@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { toast } from 'react-hot-toast'
import { updateInfo } from '../../redux/actions/user-action'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Ngày sinh' fullWidth {...props} />
})

interface FormValue {
  birthday: string
  name: string
  gender: Gender
}

const TabAccount = () => {
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [loading, setLoading] = useState(false)

  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValue>({
    defaultValues: useMemo(
      () => ({
        name: user.name,
        birthday: user.birthday,
        gender: user.gender
      }),
      [user]
    )
  })

  const onSubmit = async (values: FormValue) => {
    try {
      setLoading(true)

      await dispatch(
        updateInfo({
          birthday: values.birthday,
          gender: values.gender,
          name: values.name
        })
      )

      setLoading(false)
      toast.success('Cập nhập thông tin thành công.')
    } catch (error) {
      toast.error('Cập nhập thông tin thất bại.')
    }
  }

  useEffect(() => {
    reset(user)
    if (user.birthday) {
      setDate(new Date(user.birthday))
    }
  }, [user])

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField disabled fullWidth label='Email' placeholder='abcd@gmail.com' value={user.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='name'
              control={control}
              rules={{ required: { value: true, message: 'Vui lòng nhập tên' } }}
              render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  fullWidth
                  error={invalid}
                  helperText={error?.message}
                  label='Name'
                  placeholder='John Doe'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Controller
                name='gender'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <>
                    <Select onChange={onChange} value={value} error={invalid} label='Giới tính' defaultValue='admin'>
                      <MenuItem value={Gender.Male}>Nam</MenuItem>
                      <MenuItem value={Gender.Female}>Nữ</MenuItem>
                      <MenuItem value={Gender.Other}>Khác</MenuItem>
                    </Select>
                    {invalid && <FormHelperText error={invalid}>{error?.message}</FormHelperText>}
                  </>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                onChange={(date: Date) => {
                  setDate(date)
                  if (date) {
                    setValue('birthday', date.toISOString())
                  }
                }}
              />
              {errors.birthday && <FormHelperText error>{errors.birthday}</FormHelperText>}
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12}>
            <Button disabled={loading} variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
