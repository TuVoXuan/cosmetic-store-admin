import React, { useEffect } from 'react'
import { Button, Card, CardHeader, Chip, IconButton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { selectVariations } from '../../redux/reducers/variation-slide'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import { getVariations } from '../../redux/actions/variation-action'
import { Box } from '@mui/system'
import { useVariation } from '../../context/variation'

export default function VariantTable() {
  const variations = useAppSelector(selectVariations).variations
  const dispatch = useAppDispatch()
  const { setTab, setSelectedVariation } = useVariation()

  const fetchVariations = () => {
    dispatch(getVariations())
  }

  const showAddOptionsForm = (variationId: string) => () => {
    const selectedVariation = variations.find(item => item.variation._id === variationId)
    if (selectedVariation) {
      setSelectedVariation(selectedVariation.variation)
    }
    setTab('add-options')
  }

  useEffect(() => {
    fetchVariations()
  }, [])

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader title={'Variations'} titleTypographyProps={{ variant: 'h5' }} />
        <Button
          onClick={() => {
            setTab('create')
          }}
          sx={{ mr: 5 }}
          variant='contained'
        >
          Add Variation
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <colgroup>
            <col width='20%' />
            <col width='60%' />
            <col width='20%' />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Variation</TableCell>
              <TableCell align='center'>Options</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variations.length > 0 &&
              variations.map(({ variation, variationOptions }) => (
                <TableRow key={variation._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {variation.name.filter(item => item.language === 'vi')[0].value}
                  </TableCell>
                  <TableCell align='left'>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {variationOptions.length > 0 &&
                        variationOptions.map(option => (
                          <Chip
                            key={option._id}
                            label={option.value.filter(item => item.language === 'vi')[0].value}
                            onDelete={() => console.log('first')}
                          />
                        ))}
                    </Box>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={showAddOptionsForm(variation._id)} color='info' aria-label='add an alarm'>
                      <AddIcon />
                    </IconButton>
                    <IconButton color='error' aria-label='add an alarm'>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
