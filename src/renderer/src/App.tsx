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

function App() {
  useEffect(() => {
    void healthCheck().catch(() => {
      window.alert('서버가 꺼져있습니다.')
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
