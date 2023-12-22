import { InfoOutlined, RefreshOutlined } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import useIsScrolled from '../hooks/useIsScrolled'
import FontWeightValues from '../utils/fontTypes'
import InformationModal from './InformationModal'

function HeaderSection() {
  const [openInfo, setOpenInfo] = useState(false)
  const isScrolled = useIsScrolled()
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        bgcolor: 'rgba(255,255,255,0.7)',
        boxShadow: isScrolled ? '0px 0px 10px 4px rgba(0,0,0,0.1)' : 'none',
        transition: 'all ease-in-out 0.3s'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1024,
          mx: 'auto',
          px: 4,
          py: 2,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          color="text.secondary"
          fontWeight={FontWeightValues.SEMI_BOLD}
          sx={{
            fontSize: 24
          }}
        >
          Recruit Crawler V2
        </Typography>
        <Box display="flex">
          <Tooltip title="새로고침">
            <IconButton
              onClick={() => {
                window.location.reload()
              }}
            >
              <RefreshOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="도움말">
            <IconButton
              onClick={() => {
                setOpenInfo(true)
              }}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <InformationModal
        open={openInfo}
        onClose={() => {
          setOpenInfo(false)
        }}
      />
    </Box>
  )
}

export default HeaderSection
