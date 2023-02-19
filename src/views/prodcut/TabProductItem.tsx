// ** React Imports
import { useState, ElementType, ChangeEvent, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { Autocomplete, CardHeader, FormLabel, InputAdornment } from '@mui/material'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980
  },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    year: 2002
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    year: 1977
  },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964
  },
  { label: 'The Great Dictator', year: 1940 },
  { label: 'Cinema Paradiso', year: 1988 },
  { label: 'The Lives of Others', year: 2006 },
  { label: 'Grave of the Fireflies', year: 1988 },
  { label: 'Paths of Glory', year: 1957 },
  { label: 'Django Unchained', year: 2012 },
  { label: 'The Shining', year: 1980 },
  { label: 'WALL·E', year: 2008 },
  { label: 'American Beauty', year: 1999 },
  { label: 'The Dark Knight Rises', year: 2012 },
  { label: 'Princess Mononoke', year: 1997 },
  { label: 'Aliens', year: 1986 },
  { label: 'Oldboy', year: 2003 },
  { label: 'Once Upon a Time in America', year: 1984 },
  { label: 'Witness for the Prosecution', year: 1957 },
  { label: 'Das Boot', year: 1981 },
  { label: 'Citizen Kane', year: 1941 },
  { label: 'North by Northwest', year: 1959 },
  { label: 'Vertigo', year: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983
  },
  { label: 'Reservoir Dogs', year: 1992 },
  { label: 'Braveheart', year: 1995 },
  { label: 'M', year: 1931 },
  { label: 'Requiem for a Dream', year: 2000 },
  { label: 'Amélie', year: 2001 },
  { label: 'A Clockwork Orange', year: 1971 },
  { label: 'Like Stars on Earth', year: 2007 },
  { label: 'Taxi Driver', year: 1976 },
  { label: 'Lawrence of Arabia', year: 1962 },
  { label: 'Double Indemnity', year: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    year: 2004
  },
  { label: 'Amadeus', year: 1984 },
  { label: 'To Kill a Mockingbird', year: 1962 },
  { label: 'Toy Story 3', year: 2010 },
  { label: 'Logan', year: 2017 },
  { label: 'Full Metal Jacket', year: 1987 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 }
]

interface FormValue {
  product: IProductNameOption
  thumbnail: any
  images: any
  price: number
  // [String]: string
}

const TabProductItem = () => {
  // ** State
  const [thumbnailFile, setThumbnailFile] = useState<File>()
  const [thumbnail, setThumbnail] = useState<string>('/images/avatars/1.png')
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgSrc, setImgSrc] = useState<string[]>(['/images/avatars/1.png'])
  const [productNames, setProductNames] = useState<IProductNameOption[]>([])
  const [variationsGroup, setVariationsGroup] = useState<IVariationGroup[]>([])

  // ** Ref
  const variationContainerRef = useRef<HTMLDivElement>(null)

  // ** react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch
  } = useForm<FormValue>({
    defaultValues: {
      product: undefined
    }
  })

  const watchProduct = watch('product.value')

  const onChangeThumbnail = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setThumbnailFile(files[0])
      setThumbnail(URL.createObjectURL(files[0]))
    }
  }

  const onChangeImgs = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    const rawFiles: File[] = []
    const urlFiles: string[] = []

    if (files && files.length !== 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        rawFiles.push(file)
        urlFiles.push(URL.createObjectURL(file))
      }

      setImgFiles(rawFiles)
      setImgSrc(urlFiles)
    }
  }

  const handleGetProductNames = async () => {
    try {
      const res = await productApi.getListName()
      const options: IProductNameOption[] = res.data.data.map(item => {
        let option: IProductNameOption = { value: '', label: '', variations: [] }
        for (let i = 0; i < item.name.length; i++) {
          const element = item.name[i]
          if (element.language === 'vi') {
            option = {
              label: element.value,
              value: item._id,
              variations: item.variations
            }
          }
        }
        return option
      })

      setProductNames(options)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleGetVariationOptions = async () => {
    try {
      console.log('vo')
      const product = getValues('product')
      const optionsGroup: IVariationGroup[] = []
      for (const variationId of product.variations) {
        const res = await variationApi.getVariationOptions(variationId)
        let variationName: string = ''
        res.data.data.variationName.name.forEach(item => {
          if (item.language === 'vi') {
            variationName = item.value
          }
        })

        optionsGroup.push({
          variationName: variationName,
          variationOptions: res.data.data.variationOptions
        })

        if (variationContainerRef.current) {
          variationContainerRef.current.innerHTML += (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id={variationName}
                multiple
                options={top100Films}
                sx={{ width: '100%' }}
                renderInput={params => <TextField {...params} label={variationName} />}
              />
            </Grid>
          )
        }
      }

      setVariationsGroup(optionsGroup)
      console.log(variationsGroup)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const onSubmit = (data: any) => {
    console.log('data: ', data)
  }

  useEffect(() => {
    handleGetProductNames()
  }, [])

  // useEffect(() => {
  //   handleGetVariationOptions()
  // }, [watchProduct])

  return (
    <Fragment>
      <CardHeader title='Create Product Item' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.thumbnail?.message ? true : false}>
                Product thumbnail
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <ImgStyled src={thumbnail} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='thumbnail-upload-image'>
                    Upload Thumbnail
                    <input
                      {...register('thumbnail', { required: { value: true, message: 'Thumbnail is required' } })}
                      hidden
                      type='file'
                      onChange={e => {
                        onChangeThumbnail(e)
                      }}
                      accept='image/png, image/jpeg'
                      id='thumbnail-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      setValue('thumbnail', undefined)
                      console.log('thumbnail: ', thumbnail)
                      setThumbnail('/images/avatars/1.png')
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormLabel style={{ fontWeight: 500 }} error={errors.images?.message ? true : false}>
                Product images
              </FormLabel>
              <Box sx={{ marginTop: 4 }}>
                {imgSrc.map((img, index) => (
                  <ImgStyled key={index} src={img} alt='Product item' />
                ))}
                <Box sx={{ mt: 4 }}>
                  <ButtonStyled component='label' variant='contained' htmlFor='products-upload-image'>
                    Upload product images
                    <input
                      hidden
                      {...register('images', { required: { value: true, message: 'Images is required' } })}
                      type='file'
                      multiple
                      onChange={e => {
                        onChangeImgs(e)
                      }}
                      accept='image/png, image/jpeg'
                      id='products-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      setValue('images', undefined)
                      setImgSrc(['/images/avatars/1.png'])
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'price'}
                defaultValue={0}
                rules={{
                  required: { value: true, message: 'Price is required' },
                  min: { value: 1000, message: 'Price must be greate than 1000' }
                }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <TextField
                    fullWidth
                    error={invalid}
                    helperText={error?.message}
                    label='Price'
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>VND</InputAdornment>
                    }}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={'product'}
                rules={{ required: { value: true, message: 'Product is required' } }}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    disablePortal
                    id='product'
                    options={productNames}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                      <TextField {...params} error={invalid} helperText={error?.message} label='Product' />
                    )}
                    onChange={(e, value) => {
                      onChange(value)
                      handleGetVariationOptions()
                      return value
                    }}
                  />
                )}
              />
            </Grid>

            <div ref={variationContainerRef}></div>

            <Grid item xs={12}>
              <Button onClick={() => console.log(errors)} variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Fragment>
  )
}

export default TabProductItem
