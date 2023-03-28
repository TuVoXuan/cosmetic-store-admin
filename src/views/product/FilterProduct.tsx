import { Autocomplete, Box, Button, InputLabel, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import brandApi from '../../api/brand-api'
import categoryApi from '../../api/category-api'
import { IFilterProductForm, useFilterProduct } from '../../context/product'
import { Search } from '../../types/enum'

export default function FilterProduct() {
  const { setFilter, loading } = useFilterProduct()
  const { control, handleSubmit, reset } = useForm<IFilterProductForm>({
    defaultValues: {
      search: '',
      type: Search.Name,
      brands: [],
      categories: []
    }
  })

  const [brands, setBrands] = useState<IOption[]>([])
  const [categories, setCategories] = useState<IOption[]>([])

  const handleGetbrand = async () => {
    try {
      const res = await brandApi.getBrand()
      const options: IOption[] = res.data.data.map(item => ({ value: item._id, label: item.name }))

      setBrands(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleGetCategories = async () => {
    try {
      const res = await categoryApi.getCategory()
      const options: IOption[] = res.data.data.map(item => {
        let option: IOption = { value: '', label: '' }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id
            }
          }
        }

        return option
      })

      setCategories(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleReset = async () => {
    reset()
    setFilter({
      search: '',
      type: Search.Name,
      brands: [],
      categories: []
    })
  }

  const onSubmit = async (value: IFilterProductForm) => {
    setFilter(value)
  }

  useEffect(() => {
    handleGetbrand()
    handleGetCategories()
  }, [])

  return (
    <Card>
      <CardHeader title='Bộ lọc' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='search'
                control={control}
                render={({ field: { value, onChange }, fieldState: { error, invalid } }) => (
                  <TextField
                    fullWidth
                    label='Từ khóa'
                    error={invalid}
                    helperText={error?.message}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='type'
                control={control}
                render={({ field: { value, onChange }, fieldState: { error, invalid } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>Tìm kiếm theo</InputLabel>
                    <Select
                      fullWidth
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={value}
                      label='Tìm kiếm theo'
                      onChange={onChange}
                    >
                      <MenuItem value={Search.Id}>Mã sản phẩm</MenuItem>
                      <MenuItem value={Search.Name}>Tên sản phẩm</MenuItem>
                    </Select>
                    {invalid && <FormHelperText error={true}>{error?.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={'brands'}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    multiple
                    value={value}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    id={'brands'}
                    options={brands}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label={'Thương hiệu'} />
                    )}
                    onChange={(e, value) => {
                      onChange(value)

                      return value
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={'categories'}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    id='category'
                    multiple
                    value={value}
                    options={categories}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label='Danh mục' />
                    )}
                    onChange={(e, value) => {
                      onChange(value)

                      return value
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Box>
                <Button variant='contained' color='secondary' onClick={handleReset}>
                  Reset
                </Button>
                <Button sx={{ marginLeft: 4 }} variant='contained' type='submit' disabled={loading}>
                  Tìm kiếm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
