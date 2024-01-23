import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useJobPlanetCategories from '../hooks/useJobPlanetCategories'
import useJumpitCategories from '../hooks/useJumpitCategories'
import useProgrammersCategories from '../hooks/useProgrammersCategories'
import useRememberCategories from '../hooks/useRememberCategories'
import useWantedCategories from '../hooks/useWantedCategories'
import { Platforms } from '../utils/const'
import PlatformBlock from './PlatformBlock'

function PlatformsSection() {
  const { data: jobplanetCategories } = useJobPlanetCategories()
  const { data: jumpitCategories } = useJumpitCategories()
  const { data: programmersCategories } = useProgrammersCategories()
  const { data: rememberCategories } = useRememberCategories()
  const { data: wantedCategories } = useWantedCategories()
  return (
    <Paper variant="outlined" sx={{ p: 3, border: 'none', mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Platforms
      </Typography>
      <PlatformBlock platform={Platforms.JOBPLANET} categories={jobplanetCategories} />
      <PlatformBlock platform={Platforms.JUMPIT} categories={jumpitCategories} />
      <PlatformBlock platform={Platforms.PROGRAMMERS} categories={programmersCategories} />
      <PlatformBlock platform={Platforms.REMEMBER} categories={rememberCategories} />
      <PlatformBlock platform={Platforms.WANTED} categories={wantedCategories} />
    </Paper>
  )
}

export default PlatformsSection
