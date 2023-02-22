import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import variationApi from '../../api/variation-api'

export default function VariantTable() {
  const [variations, setVariations] = useState<IVariationOptionsRes[]>([])

  useEffect(() => {
    variationApi
      .getVariationTable()
      .then(data => setVariations(data.data.data))
      .catch(error => console.log('error: ', error))
  }, [])

  return (
    <Card>
      <CardHeader title={'Variations'} titleTypographyProps={{ variant: 'h5' }} />
      <CardContent>
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
                    <TableCell
                      align='right'
                      sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', minHeight: 68, justifyContent: 'start' }}
                    >
                      {variationOptions.length > 0 &&
                        variationOptions.map(option => (
                          <Chip
                            key={option._id}
                            label={option.value.filter(item => item.language === 'vi')[0].value}
                            onDelete={() => console.log('first')}
                          />
                        ))}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton color='info' aria-label='add an alarm'>
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
      </CardContent>
    </Card>
  )
}
