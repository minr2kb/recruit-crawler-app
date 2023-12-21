/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import { Check, Download, Error } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography
} from '@mui/material'

import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'

import {
  getPostsFromJumpit,
  getPostsFromProgrammers,
  getPostsFromRemember,
  getPostsFromWanted
} from './api/crawlers'
import ConfigSection from './components/ConfigSection'
import PlatformsSection from './components/PlatformSection'
import useJobPlanetCategories from './hooks/useJobPlanetCategories'
import useJumpitCategories from './hooks/useJumpitCategories'
import useProgrammersCategories from './hooks/useProgrammersCategories'
import useRememberCategories from './hooks/useRememberCategories'
import useWantedCategories from './hooks/useWantedCategories'
import { Platforms } from './utils/const'
import getPostsFromJobplanet from './utils/crawlers/jobplanet'
import {
  limitMonthsState,
  selectedCategoriesState,
  selectedFieldsState,
  selectedPlatformsState
} from './utils/store'
import { type ResultType, type TotalResultType } from './utils/types'

const RECRUITS_ALL_KEY = 'RECRUITS_ALL'

function App() {
  const selectedPlatforms = useAtomValue(selectedPlatformsState)
  const selectedCategories = useAtomValue(selectedCategoriesState)
  const selectedFields = useAtomValue(selectedFieldsState)
  const limitMonths = useAtomValue(limitMonthsState)

  const { data: jobplanetCategories } = useJobPlanetCategories()
  const { data: jumpitCategories } = useJumpitCategories()
  const { data: programmersCategories } = useProgrammersCategories()
  const { data: rememberCategories } = useRememberCategories()
  const { data: wantedCategories } = useWantedCategories()

  const [crawlResults, setCrawlResults] = useState<TotalResultType>()
  const [isCrawling, setIsCrawling] = useState<boolean>(false)

  const getFunc = (
    platform: Platforms
  ): ((position: string, cateKey: string, month?: number) => Promise<ResultType[]>) => {
    switch (platform) {
      case Platforms.JUMPIT:
        return getPostsFromJumpit
      case Platforms.PROGRAMMERS:
        return getPostsFromProgrammers
      case Platforms.JOBPLANET:
        return getPostsFromJobplanet
      case Platforms.WANTED:
        return getPostsFromWanted
      case Platforms.REMEMBER:
        return getPostsFromRemember
      default:
        return async () => []
    }
  }

  const getPosts = async (platform: Platforms) => {
    const promises =
      selectedCategories[platform]?.map(async (cate) => {
        const data = await getFunc(platform)(cate.label, String(cate.value), limitMonths)
        console.log('data', data)
        setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: data }))
        return data
      }) ?? []

    const results = await Promise.all(promises)
    const fullData = ([] as ResultType[]).concat(...results)
    setCrawlResults((prev) => ({ ...prev, [`${platform}_ALL`]: fullData }))
    return fullData
  }

  const onClickStart = async () => {
    try {
      console.time('⏱️ Total time spent')
      console.log('\n\n####### 🚗 Initializing 🚗 #######\n\n')
      setIsCrawling(true)
      setCrawlResults({})
      const promises = selectedPlatforms.map(
        // eslint-disable-next-line no-return-await
        async (selectedPlatform) => await getPosts(selectedPlatform)
      )

      const results = await Promise.all(promises)
      const fullData = ([] as ResultType[]).concat(...results)

      setCrawlResults((prev) => ({ ...prev, [RECRUITS_ALL_KEY]: fullData }))
      setIsCrawling(false)

      console.log('\n\n####### ✨ Done ✨ #######\n\n')
      console.timeLog('⏱️ Total time spent')
    } catch (err) {
      console.error('🛑 ERROR OCCURED', err)
    }
  }

  const getStateIcon = useCallback(
    (key: string) => {
      if (!crawlResults?.[key])
        return isCrawling ? <CircularProgress size={20} sx={{ p: 0.5 }} /> : undefined
      return crawlResults[key].length > 0 ? (
        <Check fontSize="small" color="primary" />
      ) : (
        <Error fontSize="small" color="error" />
      )
    },
    [crawlResults, isCrawling]
  )

  useEffect(() => {
    console.log(crawlResults)
  }, [crawlResults])

  return (
    <Box>
      <Typography variant="h3">Recruit Crawler V2</Typography>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, border: 'none' }}>
            <Typography variant="h5">Config</Typography>
            <ConfigSection />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, border: 'none' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Platforms
            </Typography>
            <PlatformsSection platform={Platforms.JOBPLANET} categories={jobplanetCategories} />
            <PlatformsSection platform={Platforms.JUMPIT} categories={jumpitCategories} />
            <PlatformsSection platform={Platforms.PROGRAMMERS} categories={programmersCategories} />
            <PlatformsSection platform={Platforms.REMEMBER} categories={rememberCategories} />
            <PlatformsSection platform={Platforms.WANTED} categories={wantedCategories} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, border: 'none' }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h5">Result</Typography>

              <Button
                variant="contained"
                onClick={onClickStart}
                disabled={
                  isCrawling ||
                  Object.values(selectedCategories).some((cates) => (cates?.length ?? 0) < 1)
                }
              >
                START
              </Button>
            </Box>
            <Grid container spacing={2}>
              {selectedPlatforms.map((platform) => (
                <Grid item xs={12} sm={6} md={3} key={`selected-platform-${platform}`}>
                  <Card variant="outlined">
                    <CardContent
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {platform}
                      </Typography>
                      {(!selectedCategories[platform] ||
                        selectedCategories[platform]?.length === 0) && (
                        <Typography variant="body2" color="text.secondary">
                          선택된 직무가 없습니다.
                        </Typography>
                      )}
                      {selectedCategories[platform]?.map((cate) => {
                        const key = `${platform}_${cate.label}`
                        return crawlResults?.[key] && crawlResults?.[key].length > 0 ? (
                          <CSVLink
                            key={`${platform}-${cate.value}-label`}
                            filename={key}
                            data={crawlResults?.[key] ?? []}
                            headers={selectedFields}
                            style={{
                              width: '100%',
                              textDecoration: 'none'
                            }}
                          >
                            <Chip
                              sx={{ my: 0.5, mr: 0.5 }}
                              label={`${cate.label} (${crawlResults[key].length})`}
                              variant="outlined"
                              icon={getStateIcon(key)}
                            />
                          </CSVLink>
                        ) : (
                          <Chip
                            key={`${platform}-${cate.value}-label`}
                            sx={{ my: 0.5, mr: 0.5 }}
                            label={cate.label}
                            variant="outlined"
                            icon={getStateIcon(key)}
                          />
                        )
                      })}
                    </CardContent>
                    <CardActions>
                      <CSVLink
                        filename={`${platform}_ALL.csv`}
                        data={crawlResults?.[`${platform}_ALL`] ?? []}
                        headers={selectedFields}
                        style={{ width: '100%' }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          disabled={!crawlResults?.[`${platform}_ALL`]}
                        >
                          {platform}_ALL.csv
                          <Download fontSize="small" />
                        </Button>
                      </CSVLink>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default App
