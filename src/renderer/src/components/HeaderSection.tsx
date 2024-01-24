import InfoOutlined from '@mui/icons-material/InfoOutlined'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import useIsScrolled from '../hooks/useIsScrolled'
import FontWeightValues from '../utils/fontTypes'
import InformationModal from './InformationModal'
import { Chip } from '@mui/material'
import {  useAtomValue } from 'jotai'
import { serverStatusState } from '../utils/store'
import { ServerStatus } from '../utils/const'

function HeaderSection() {
  const serverStatus = useAtomValue(serverStatusState)
  const [openInfo, setOpenInfo] = useState(false)
  const [appVersion, setAppVersion] = useState('')
  const isScrolled = useIsScrolled()

  const getServerStatusChip = useCallback(() => {
    switch (serverStatus) {
      case ServerStatus.ONLINE:
        return <Chip color='primary' variant='outlined' label='서버 실행중' />
      case ServerStatus.OFFLINE:
        return <Chip color='error' variant='outlined' label='서버 중지됨' />
      case ServerStatus.STARTING:
        return <Chip color='warning' variant='outlined' label='서버 시작중' />
      default:
        return <Chip color='error' variant='outlined' label='서버 OFFLINE' />
    }
  }, [serverStatus])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    window.api.getAppVersion().then((version) => {
      setAppVersion(version)
    })
  }, [])

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
        <Box display="flex">
          <Typography
            color="text.secondary"
            fontWeight={FontWeightValues.SEMI_BOLD}
            sx={{
              fontSize: 24
            }}
          >
            Recruit Crawler
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 12,
              ml: 0.5
            }}
          >
            v{appVersion}
          </Typography>
        </Box>
        <Box display="flex" alignItems={"center"}>
          {getServerStatusChip()}
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
