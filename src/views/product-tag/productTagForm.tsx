import React, { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { createTag, updateTag } from '../../redux/actions/tag-action'
import { toast } from 'react-hot-toast'
import { useTag } from '../../context/tag'
import FormLabel from '@mui/material/FormLabel'
import { Autocomplete, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import { selectTags } from '../../redux/reducers/tag-slice'

interface FormValue {
  name: string
  weight: IOption
  tagGroup: IOption
}

const importances: IOption[] = [
  { label: 'Bình thường', value: '1' },
  { label: 'Quan trọng', value: '3' }
]

export default function ProductTagForm() {
  const dispatch = useAppDispatch()
  const tagGroups: IOption[] = useAppSelector(selectTags).tagGroups.map(item => ({ label: item.name, value: item._id }))
  const { selectedTag, setSelectedTag } = useTag()

  const [loading, setLoading] = useState<boolean>(false)

  const { control, handleSubmit, reset, setValue } = useForm<FormValue>({
    defaultValues: {
      name: '',
      weight: importances[0],
      tagGroup: tagGroups[0]
    }
  })

  const onSubmit = async (value: FormValue) => {
    setLoading(true)
    try {
      if (selectedTag) {
        console.log('value: ', value)
        await dispatch(
          updateTag({
            id: selectedTag._id,
            name: value.name,
            weight: parseInt(value.weight.value),
            parent: value.tagGroup.value
          })
        )
        setSelectedTag(undefined)
        toast.success('Cập nhập thẻ thành công')
      } else {
        await dispatch(
          createTag({ name: value.name, weight: parseInt(value.weight.value), parent: value.tagGroup.value })
        ).unwrap()
        toast.success('Tạo thẻ thành công')
      }
      reset()
    } catch (error) {
      console.log('error: ', error)
      toast.error('Đã xảy ra lỗi')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selectedTag) {
      setValue('name', selectedTag.name)
      setValue('weight', importances.find(item => item.value === selectedTag.weight.toString()) || importances[0])
      setValue('tagGroup', tagGroups.find(item => item.value === selectedTag.parent) || tagGroups[0])
    } else {
      reset()
    }
  }, [selectedTag])

  return (
    <Card>
      <CardHeader title={selectedTag ? 'Cập nhập thẻ' : 'Tạo thẻ'} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} lg={5}>
              <FormControl fullWidth>
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
                      label='Tên thẻ'
                      placeholder='Kem chống nắng'
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={5}>
              <FormControl fullWidth>
                <Controller
                  name={'weight'}
                  rules={{ required: { value: true, message: `Yêu cầu chọn trọng số` } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='weight'
                      value={value}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      defaultValue={importances.find(item => item.value === selectedTag?.weight.toString())}
                      options={importances}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Trọng số' />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={5}>
              <FormControl fullWidth>
                <Controller
                  name={'tagGroup'}
                  rules={{ required: { value: true, message: `Yêu cầu chọn nhóm thẻ` } }}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      disablePortal
                      id='tagGroup'
                      value={value}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      defaultValue={tagGroups.find(item => item.value === selectedTag?.parent)}
                      options={tagGroups}
                      sx={{ width: '100%' }}
                      renderInput={params => (
                        <TextField {...params} error={invalid} helperText={error?.message} label='Nhóm thẻ' />
                      )}
                      onChange={(e, value) => {
                        onChange(value)

                        return value
                      }}
                    />
                  )}
                />
              </FormControl>
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
