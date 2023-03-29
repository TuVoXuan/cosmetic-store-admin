import React, { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store/configureStore'
import { toast } from 'react-hot-toast'
import { useTag } from '../../context/tag'
import { createTagGroup, updateTagGroup } from '../../redux/actions/tag-action'

interface FormValue {
  name: string
}

export default function ProductTagGroupForm() {
  const dispatch = useAppDispatch()
  const { selectedTagGroup, setSelectedTagGroup } = useTag()

  const { control, handleSubmit, reset, setValue } = useForm<FormValue>({
    defaultValues: {
      name: ''
    }
  })

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async (value: FormValue) => {
    setLoading(true)
    try {
      if (selectedTagGroup) {
        toast.loading('Đang cập nhập nhóm thẻ ...', { id: 'updateTagGroupToast' })
        await dispatch(updateTagGroup({ _id: selectedTagGroup._id, name: value.name })).unwrap()
        toast.dismiss('updateTagGroupToast')
        toast.success('Cập nhập nhóm thẻ thành công')
      } else {
        toast.loading('Đang tạo nhóm thẻ ...', { id: 'createTagGroupToast' })
        await dispatch(createTagGroup(value.name)).unwrap()
        toast.dismiss('createTagGroupToast')
        toast.success('Tạo nhóm thẻ thành công')
      }

      reset()
    } catch (error) {
      toast.dismiss('createTagGroupToast')
      toast.dismiss('updateTagGroupToast')
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selectedTagGroup) {
      setValue('name', selectedTagGroup.name)
    } else {
      reset()
    }
  }, [selectedTagGroup])

  return (
    <Card>
      <CardHeader title={'Tạo nhóm thẻ'} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} lg={5}>
              <Controller
                control={control}
                name={'name'}
                rules={{ required: { value: true, message: 'Yêu cầu nhập tên thẻ' } }}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    value={value}
                    onChange={onChange}
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Tên nhóm thẻ'
                    placeholder='phân loại'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button disabled={loading} type='submit' variant='contained' size='large'>
                Lưu
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
