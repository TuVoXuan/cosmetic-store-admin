import { Button, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { getShippingFeePerKM, updateShippingFeePerKM } from '../../redux/actions/setting-action'
import { selectSetting } from '../../redux/reducers/setting-slice'
import { toast } from 'react-hot-toast'

interface FormValue {
  value: number
}

export default function SettingItem() {
  const dispatch = useAppDispatch()
  const shippingFeePerKM = useAppSelector(selectSetting).shippingFeePerKM
  const { control, setValue, handleSubmit } = useForm<FormValue>()

  const handleGetShippingFeePerKM = async () => {
    await dispatch(getShippingFeePerKM())
  }

  const onSubmit = async (val: FormValue) => {
    try {
      toast.loading('Đang cập nhập...', { id: 'updateSetting' })
      await dispatch(updateShippingFeePerKM(val.value))
      toast.dismiss('updateSetting')
      toast.success('Cập nhập thành công')
    } catch (error) {
      toast.error((error as IResponseError).error)
    }
  }

  useEffect(() => {
    handleGetShippingFeePerKM()
  }, [])

  useEffect(() => {
    setValue('value', shippingFeePerKM)
  }, [shippingFeePerKM])

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', columnGap: '12px' }}>
      <Controller
        name={'value'}
        defaultValue={0}
        rules={{
          required: { value: true, message: 'Yêu cầu nhập giá trị' },
          min: { value: 0, message: 'Giá trị phải lớn hơn 0' }
        }}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
          <TextField
            type='number'
            error={invalid}
            helperText={error?.message}
            fullWidth
            label='Phí vận chuyển'
            placeholder='0'
            onChange={onChange}
            value={value}
          />
        )}
      />

      <Button type='submit' variant='contained'>
        Lưu
      </Button>
    </form>
  )
}
