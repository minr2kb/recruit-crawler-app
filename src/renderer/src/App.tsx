/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { useEffect } from 'react'
import { healthCheck } from './api/healthCheck'
import ConfigSection from './components/ConfigSection'
import HeaderSection from './components/HeaderSection'
import PlatformsSection from './components/PlatformsSection'
import ResultSection from './components/ResultSection'
import { useSetAtom } from 'jotai'
import { serverStatusState } from './utils/store'
import { ServerStatus } from './utils/const'

function App() {
  const setServerStatus = useSetAtom(serverStatusState)
  
  useEffect(() => {
    void healthCheck().then(()=>{
      setServerStatus(ServerStatus.ONLINE)
    }).catch(() => {
      window.api.startServer().then(() => {
        setServerStatus(ServerStatus.STARTING)
        // 2초마다 체크하여 서버가 켜졌는지 확인
        const interval = setInterval(() => {
          void healthCheck().then(() => {
            setServerStatus(ServerStatus.ONLINE)
            clearInterval(interval)
          })
        }, 2000)
      }).catch(() => {
         setServerStatus(ServerStatus.OFFLINE)
        window.alert('서버를 켜는데 실패했습니다.')
      })
    })
  }, [])

  return (
    <Box>
      <HeaderSection />
      <Grid container spacing={2} mt={7} position="relative">
        <Grid item xs={12} md={6}>
          <ConfigSection />
          <PlatformsSection />
        </Grid>
        <Grid item xs={12} md={6} sx={{ position: 'sticky', top: 70, alignSelf: 'flex-start' }}>
          <ResultSection />
        </Grid>
      </Grid>
    </Box>
  )
}

export default App
