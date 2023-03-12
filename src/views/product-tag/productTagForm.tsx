import React, { useEffect } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store/configureStore'
import { createTag, updateTag } from '../../redux/actions/tag-action'
import { toast } from 'react-hot-toast'
import { useTag } from '../../context/tag'
import FormLabel from '@mui/material/FormLabel'
import { Autocomplete, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

interface FormValue {
  name: string
  weight: IOption
}

const importances: IOption[] = [
  { label: 'Normal', value: '1' },
  { label: 'Importance', value: '3' }
]

export default function ProductTagForm() {
  const dispatch = useAppDispatch()
  const { selectedTag } = useTag()

  const { control, handleSubmit, reset, setValue } = useForm<FormValue>({
    defaultValues: {
      name: '',
      weight: importances[0]
    }
  })

  const onSubmit = async (value: FormValue) => {
    try {
      if (selectedTag) {
        await dispatch(
          updateTag({
            id: selectedTag._id,
            name: value.name,
            weight: parseInt(value.weight.value)
          })
        ).unwrap()

        toast.success('Update product tag success')
      } else {
        await dispatch(createTag({ name: value.name, weight: parseInt(value.weight.value) })).unwrap()
        toast.success('Create product tag success.')
      }
      reset()
    } catch (error) {
      console.log('error: ', error)
      toast.error('Have some errors')
    }
  }

  useEffect(() => {
    if (selectedTag) {
      setValue('name', selectedTag.name)
      setValue('weight', importances.find(item => item.value === selectedTag.weight.toString()) || importances[0])
    } else {
      reset()
    }
  }, [selectedTag])

  return (
    <Card>
      <CardHeader title={selectedTag ? 'Update Tag' : 'Create Tag'} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} lg={5}>
              <Controller
                control={control}
                name={'name'}
                rules={{ required: { value: true, message: 'Name is required' } }}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    value={value}
                    onChange={onChange}
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Name'
                    placeholder='Leonard Carter'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Controller
                name={'weight'}
                rules={{ required: { value: true, message: `Weight is required` } }}
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
                      <TextField {...params} error={invalid} helperText={error?.message} label='Importance' />
                    )}
                    onChange={(e, value) => {
                      onChange(value)

                      return value
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
