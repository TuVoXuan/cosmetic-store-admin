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
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { selectTags } from '../../redux/reducers/tag-slice'

interface FormValue {
  name: string
  weight: string
  tagGroup: string
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
      weight: '',
      tagGroup: ''
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
            weight: parseInt(value.weight),
            parent: value.tagGroup
          })
        ).unwrap()
        setSelectedTag(undefined)
        toast.success('Cập nhập thẻ thành công')
      } else {
        await dispatch(createTag({ name: value.name, weight: parseInt(value.weight), parent: value.tagGroup })).unwrap()
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
      setValue(
        'weight',
        importances.find(item => item.value === selectedTag.weight.toString())?.value || importances[0].value
      )
      setValue('tagGroup', tagGroups.find(item => item.value === selectedTag.parent)?.value || tagGroups[0].value)
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
              <Controller
                name={'tagGroup'}
                rules={{ required: { value: true, message: `Yêu cầu chọn nhóm thẻ` } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='tagGroup-lable'>Nhóm thẻ</InputLabel>
                    <Select labelId='tagGroup-lable' onChange={onChange} value={value} error={invalid} label='Nhóm thẻ'>
                      {tagGroups.length > 0 &&
                        tagGroups.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                    </Select>
                    {invalid && <FormHelperText error={invalid}>{error?.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} lg={5}>
              <Controller
                name={'weight'}
                rules={{ required: { value: true, message: `Yêu cầu chọn trọng số` } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='important-label'>Trọng số</InputLabel>
                    <Select
                      labelId='important-label'
                      onChange={onChange}
                      value={value}
                      error={invalid}
                      label='Trọng số'
                    >
                      {importances.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {invalid && <FormHelperText error={invalid}>{error?.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

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
