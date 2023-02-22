import React, { Fragment, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Grid, IconButton, TextField } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, useForm } from 'react-hook-form'
import variationApi from '../../api/variation-api'

interface IFormVariation {
  variationVi: string
  variationEn: string
  [index: string]: string
}

export default function CreateVariationForm() {
  const [optionList, setOptionList] = useState<string[]>([])

  const { control, handleSubmit, unregister } = useForm<IFormVariation>()

  const add = () => {
    const num = Math.floor(Math.random() * 1000)
    console.log('num: ', num)
    setOptionList(value => [...value, 'option' + num])
  }

  const remove = (name: string) => () => {
    unregister(name + 'vi')
    unregister(name + 'en')
    setOptionList(value => value.filter(item => item !== name))
  }

  const onSubmit = async (value: IFormVariation) => {
    const options: ITranslateV2[] = optionList.map(name => ({
      vi: value[name + 'vi'],
      en: value[name + 'en']
    }))

    variationApi
      .createVariation({
        name: [
          {
            language: 'vi',
            value: value['variationVi']
          },
          {
            language: 'en',
            value: value['variationEn']
          }
        ],
        options
      })
      .then(() => console.log('success'))
      .catch(error => console.log('error: ', error))
  }

  return (
    <Card>
      <CardHeader title={'Add variation'} titleTypographyProps={{ variant: 'h5' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={5}>
              <Controller
                name={'variationVi'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Variation is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Variation (vi)'
                    placeholder='Công dụng'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Controller
                name={'variationEn'}
                defaultValue={''}
                rules={{ required: { value: true, message: 'Variation is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    error={invalid}
                    helperText={error?.message}
                    fullWidth
                    label='Variation (en)'
                    placeholder='Công dụng'
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            {optionList.length > 0 &&
              optionList.map(option => (
                <Fragment key={option}>
                  <Grid item sm={5}>
                    <Controller
                      name={option + 'vi'}
                      defaultValue={''}
                      rules={{ required: { value: true, message: 'Option is required' } }}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                        <TextField
                          error={invalid}
                          helperText={error?.message}
                          fullWidth
                          label='Option (vi)'
                          placeholder='Công dụng'
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={5}>
                    <Controller
                      name={option + 'en'}
                      defaultValue={''}
                      rules={{ required: { value: true, message: 'Option is required' } }}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                        <TextField
                          error={invalid}
                          helperText={error?.message}
                          fullWidth
                          label='Option (en)'
                          placeholder='Công dụng'
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={2} sx={{ display: 'grid', alignItems: 'center', justifyContent: 'start' }}>
                    <IconButton color='secondary' onClick={remove(option)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Fragment>
              ))}
            <Grid item xs={12} sm={7}>
              <Button color='primary' variant='outlined' onClick={add}>
                Add Option
              </Button>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Button color='primary' variant='contained' type='submit'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
