import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import { useAtom } from 'jotai/react'
import { useState } from 'react'

import { type Platforms } from '../utils/const'
import { selectedCategoriesState, selectedPlatformsState } from '../utils/store'
import { type CategoryFilterType } from '../utils/types'
import FilterModal from './FilterModal'

interface Props {
  platform: Platforms
  categories?: CategoryFilterType[]
}

function PlatformBlock({ platform, categories = [] }: Props) {
  const [selectedPlatforms, setSelectedPlatforms] = useAtom(selectedPlatformsState)
  const [selectedCategories, setSelectedCategories] = useAtom(selectedCategoriesState)
  const [open, setOpen] = useState<boolean>(false)
  const [openCates, setOpenCates] = useState<boolean>(false)

  const handleToggle = (platform: Platforms) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        setOpen(false)
        return prev.filter((p) => p !== platform)
      }
      setOpen(true)
      return [...prev, platform]
    })
  }

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const onSaveCates = (cates: CategoryFilterType[]) => {
    setSelectedCategories((prev) => ({ ...prev, [platform]: cates }))
  }

  const handleDeleteCate = (value?: number | string) => {
    if (!value) return
    const newSelectedValues =
      selectedCategories[platform]?.filter((item) => item.value !== value) ?? []
    setSelectedCategories((prev) => ({ ...prev, [platform]: newSelectedValues }))
  }

  const handleResetCate = () => {
    setSelectedCategories((prev) => ({ ...prev, [platform]: [] }))
  }

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardHeader
          subheader={`${platform} (${selectedCategories[platform]?.length ?? 0})`}
          action={
            <Switch
              checked={selectedPlatforms.includes(platform)}
              onChange={() => {
                handleToggle(platform)
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          }
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
        />
        <Collapse in={open}>
          <CardContent>
            {(!selectedCategories[platform] || selectedCategories[platform]?.length === 0) && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                선택된 직무가 없습니다.
              </Typography>
            )}
            {selectedCategories[platform]?.map((cate) => (
              <Chip
                key={`${platform}-${cate.value}`}
                sx={{ m: 0.5 }}
                label={cate.label}
                variant="filled"
                onDelete={() => {
                  handleDeleteCate(cate.value)
                }}
              />
            ))}
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Button fullWidth variant="outlined" onClick={handleResetCate}>
              초기화
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setOpenCates(true)
              }}
            >
              추가하기
            </Button>
          </CardActions>
        </Collapse>
      </Card>

      {categories && (
        <FilterModal
          open={openCates}
          handleClose={() => {
            setOpenCates(false)
          }}
          initVal={selectedCategories[platform]}
          data={categories}
          onSave={onSaveCates}
        />
      )}
    </Box>
  )
}

export default PlatformBlock
