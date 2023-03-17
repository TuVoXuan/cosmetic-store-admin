import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTag } from '../../context/tag'
import { deleteTag, getTags } from '../../redux/actions/tag-action'
import { selectTags } from '../../redux/reducers/tag-slice'
import { useAppDispatch, useAppSelector } from '../../store/configureStore'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

export default function ProductTagTable() {
  const { setSelectedTag } = useTag()
  const tags = useAppSelector(selectTags).tags
  const dispatch = useAppDispatch()

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTag(id)).unwrap()
      toast.success('Delete product tag success')
    } catch (error) {
      console.log('error: ', error)
      toast.error((error as IResponseError).error)
    }
  }

  const handleConfirmDeleteOption = (tag: ITag) => () => {
    toast.loading(
      t => (
        <Box>
          <p>
            Do want to delete <span style={{ fontWeight: 700 }}>{tag.name}</span>?
          </p>
          <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '12px' }}>
            <Button onClick={() => toast.dismiss(t.id)} type='button' color='error' variant='text'>
              no
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id)
                handleDelete(tag._id)
              }}
              type='button'
              color='error'
              variant='contained'
            >
              Yes
            </Button>
          </Box>
        </Box>
      ),
      {
        id: 'warningToast',
        style: { maxWidth: '500px' },
        icon: <WarningRoundedIcon color='error' />
      }
    )
  }

  const fetchTags = async () => {
    await dispatch(getTags()).unwrap()
  }

  const handleOnClick = (tag: ITag) => () => {
    setSelectedTag(tag)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader title='Product Tags' titleTypographyProps={{ variant: 'h6' }} />
        <Button
          onClick={() => setSelectedTag(undefined)}
          size='medium'
          variant='contained'
          type='submit'
          sx={{ mr: 5 }}
        >
          Create Tag
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableBody>
            <TableRow>
              <TableCell sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {tags.length > 0 &&
                  tags.map(item => (
                    <Chip
                      key={item._id}
                      label={item.name}
                      onClick={handleOnClick(item)}
                      onDelete={handleConfirmDeleteOption(item)}
                    />
                  ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
