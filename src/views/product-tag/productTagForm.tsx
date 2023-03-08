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

interface FormValue {
  name: string
}

export default function ProductTagForm() {
  const dispatch = useAppDispatch()
  const { selectedTag } = useTag()

  const { control, handleSubmit, reset, setValue } = useForm<FormValue>({
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async (value: FormValue) => {
    try {
      if (selectedTag) {
        await dispatch(
          updateTag({
            id: selectedTag._id,
            name: value.name
          })
        )

        toast.success('Update product tag success')
      } else {
        await dispatch(createTag(value.name))
        toast.success('Create product tag success.')
      }
      reset()
    } catch (error) {
      console.log('error: ', error)
    }
  }

  useEffect(() => {
    if (selectedTag) {
      setValue('name', selectedTag.name)
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
