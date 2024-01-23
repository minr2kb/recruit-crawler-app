import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { type CategoryFilterType } from '../utils/types'

interface Props {
  open: boolean
  handleClose: () => void
  onSave: (selectedValues: CategoryFilterType[]) => void
  data: CategoryFilterType[]
  initVal?: CategoryFilterType[]
}

function FilterModal({ data, open, handleClose, onSave, initVal = [] }: Props) {
  const [selectedDepth1, setSelectedDepth1] = useState<CategoryFilterType | null>(data[0])
  const [selectedValues, setSelectedValues] = useState<CategoryFilterType[]>([])

  const handleDepth1Click = (item: CategoryFilterType) => {
    setSelectedDepth1(item)
  }

  const handleToggle = (item: CategoryFilterType) => {
    const currentIndex = selectedValues.findIndex((selected) => selected.value === item.value)
    const newSelectedValues = [...selectedValues]

    if (currentIndex === -1) {
      newSelectedValues.push(item)
    } else {
      newSelectedValues.splice(currentIndex, 1)
    }

    setSelectedValues(newSelectedValues)
  }

  const handleDelete = (value?: number | string) => {
    if (!value) return
    const newSelectedValues = selectedValues.filter((item) => item.value !== value)
    setSelectedValues(newSelectedValues)
  }

  const getSelectedCount = (item: CategoryFilterType) => {
    return (
      item.children?.filter((child) =>
        selectedValues.some((selected) => selected.value === child.value)
      ).length ?? 0
    )
  }

  const isSelected = (item: CategoryFilterType) => {
    return selectedValues.some((selected) => selected.value === item.value)
  }

  useEffect(() => {
    if (open) setSelectedValues(initVal)
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle p={0}>
        {selectedValues.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ m: 1 }}>
            선택된 직무가 없습니다.
          </Typography>
        )}
        {selectedValues.map((cate) => (
          <Chip
            key={`selected-${cate.value}`}
            sx={{ m: 0.5 }}
            label={cate.label}
            variant="outlined"
            onDelete={() => {
              handleDelete(cate.value)
            }}
          />
        ))}
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ position: 'static', display: 'flex', p: 0, minHeight: '50vh', overflow: 'hidden' }}
      >
        <Grid container>
          <Grid item xs={6} sx={{ height: '100%', overflow: 'auto' }}>
            <List disablePadding>
              {data.map((item) => {
                const selectedCount = getSelectedCount(item)
                return (
                  <ListItem
                    key={item.label}
                    disablePadding
                    onClick={() => {
                      handleDepth1Click(item)
                    }}
                  >
                    <ListItemButton>
                      <ListItemText primary={`${item.label} (${item.children?.length ?? 0})`} />
                      {(item.children?.length ?? 0) > 0 && (
                        <>
                          {selectedCount > 0 && <Chip size="small" label={selectedCount} />}
                          <ArrowForwardIosIcon
                            color={selectedDepth1?.label === item.label ? 'primary' : 'disabled'}
                            fontSize="small"
                          />
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ ml: '-1px' }} />

          <Grid item xs={6} sx={{ height: '100%', overflow: 'auto' }}>
            <List disablePadding>
              {selectedDepth1?.children?.map((child) => (
                <ListItem
                  key={child.label}
                  role={undefined}
                  dense
                  onClick={() => {
                    handleToggle(child)
                  }}
                >
                  <Checkbox edge="start" checked={isSelected(child)} tabIndex={-1} disableRipple />
                  <ListItemText primary={child.label} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(selectedValues)
            handleClose()
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FilterModal
