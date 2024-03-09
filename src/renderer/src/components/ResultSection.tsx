/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import Check from '@mui/icons-material/Check'
import DataArray from '@mui/icons-material/DataArray'
import Error from '@mui/icons-material/Error'
import Download from '@mui/icons-material/Download'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'

import { CSVLink } from 'react-csv'

import { Platforms, ServerStatus } from '../utils/const'
import getPostsFromJobplanet from '../utils/crawlers/jobplanet'
import getPostsFromJumpit from '../utils/crawlers/jumpit'
import getPostsFromProgrammers from '../utils/crawlers/programmers'
import getPostsFromRemember from '../utils/crawlers/remember'
import getPostsFromWanted from '../utils/crawlers/wanted'
import getPostsFromJobKorea from '../utils/crawlers/jobkorea'
import {
  serverStatusState,
  limitMonthsState,
  progressLogState,
  selectedCategoriesState,
  selectedFieldsState,
  selectedPlatformsState,
  isCrawlingState
} from '../utils/store'
import { type ResultType, type TotalResultType } from '../utils/types'

const RECRUITS_ALL_KEY = 'RECRUITS_ALL'

const MAX_ASYNC_COUNT = 5

function ResultSection() {
  const selectedPlatforms = useAtomValue(selectedPlatformsState)
  const selectedCategories = useAtomValue(selectedCategoriesState)
  const selectedFields = useAtomValue(selectedFieldsState)
  const limitMonths = useAtomValue(limitMonthsState)
  const serverStatus = useAtomValue(serverStatusState)
  const [progressLog, setProgressLog] = useAtom(progressLogState)

  const controllerRef = useRef<AbortController>()
  const consoleScrollRef = useRef<HTMLDivElement>(null)

  const [crawlResults, setCrawlResults] = useState<TotalResultType>()
  const [isCrawling, setIsCrawling] = useAtom(isCrawlingState)

  const getFunc = (
    platform: Platforms,
    controller: AbortController
  ): ((position: string, cateKey: string, month?: number) => Promise<ResultType[]>) => {
    switch (platform) {
      case Platforms.JOBPLANET:
        return getPostsFromJobplanet(controller)
      case Platforms.JUMPIT:
        return getPostsFromJumpit(controller)
      case Platforms.PROGRAMMERS:
        return getPostsFromProgrammers(controller)
      case Platforms.REMEMBER:
        return getPostsFromRemember(controller)
      case Platforms.WANTED:
        return getPostsFromWanted(controller)
      case Platforms.JOBKOREA:
        return getPostsFromJobKorea(controller)
      default:
        return async () => []
    }
  }

  const getPostsAsync = async (platform: Platforms, controller: AbortController) => {
    const promises =
      selectedCategories[platform]?.map(async (cate) => {
        try {
          const data = await getFunc(platform, controller)(
            cate.label,
            String(cate.value),
            limitMonths
          )
          setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: data }))
          return data
        } catch (err) {
          setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: null }))
          return null
        }
      }) ?? []

    const results = await Promise.all(promises)
    const noneNullResults = results.filter((r) => r !== null) as unknown as ResultType[]
    const fullData = ([] as ResultType[]).concat(...noneNullResults)
    setCrawlResults((prev) => ({ ...prev, [`${platform}_ALL`]: fullData }))
    return fullData
  }

  const getPosts = async (platform: Platforms, controller: AbortController) => {
    const fullData = [] as ResultType[]
    const selectedCategory = selectedCategories[platform]
    if (selectedCategory && selectedCategory.length <= MAX_ASYNC_COUNT) {
      // eslint-disable-next-line no-return-await
      return await getPostsAsync(platform, controller)
    }

    if (selectedCategory) {
      for (const cate of selectedCategory) {
        try {
          const data = await getFunc(platform, controller)(
            cate.label,
            String(cate.value),
            limitMonths
          )
          setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: data }))
          if (data !== null) {
            fullData.push(...data)
          }
        } catch (err) {
          setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: null }))
        }
      }
    }

    setCrawlResults((prev) => ({ ...prev, [`${platform}_ALL`]: fullData }))
    return fullData
  }

  const onClickStart = async () => {
    try {
      const startTime = new Date()
      setProgressLog('')
      setIsCrawling(true)
      setCrawlResults({})
      console.log('####### 🚗 Initializing 🚗 #######\n')

      const abortController = new AbortController()
      controllerRef.current = abortController

      const promises = selectedPlatforms.map(
        // eslint-disable-next-line no-return-await
        async (selectedPlatform) => await getPosts(selectedPlatform, abortController)
      )

      const results = await Promise.all(promises)
      const fullData = ([] as ResultType[]).concat(...results)

      setCrawlResults((prev) => ({ ...prev, [RECRUITS_ALL_KEY]: fullData }))
      setIsCrawling(false)

      console.log('\n####### ✨ Done ✨ #######')
      console.log('⏱️ Total time spent: ', (new Date().getTime() - startTime.getTime()) / 1000, 's')
    } catch (err) {
      setIsCrawling(false)
      window.alert('🛑 ERROR OCCURED')
    }
  }

  const onClickStop = () => {
    controllerRef.current?.abort()
    setIsCrawling(false)
  }

  const onClickReset = () => {
    setCrawlResults(undefined)
    setProgressLog('')
  }

  const getStateIcon = useCallback(
    (key: string) => {
      const res = crawlResults?.[key]
      if (res === undefined)
        return isCrawling ? <CircularProgress size={20} sx={{ p: 0.5 }} /> : undefined
      if (res === null) return <Error fontSize="small" color="error" />
      return res.length > 0 ? (
        <Check fontSize="small" color="primary" />
      ) : (
        <DataArray fontSize="small" color="disabled" />
      )
    },
    [crawlResults, isCrawling]
  )

  const scrollToBottom = () => {
    if (consoleScrollRef.current) {
      consoleScrollRef.current.scrollTop = consoleScrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-global-assign
    console = {
      ...console,
      log: (...args) => {
        setProgressLog((prev) => `${prev}\n${args.join(' ')}`)
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [progressLog])

  return (
    <Paper variant="outlined" sx={{ p: 3, border: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Result</Typography>
        <Box display="flex">
          {crawlResults?.[RECRUITS_ALL_KEY] ? (
            <CSVLink
              filename={`${RECRUITS_ALL_KEY}.csv`}
              data={crawlResults?.[RECRUITS_ALL_KEY] ?? []}
              headers={selectedFields}
            >
              <Button
                fullWidth
                size="small"
                disabled={!crawlResults?.[RECRUITS_ALL_KEY]}
                sx={{ mr: 2 }}
              >
                {RECRUITS_ALL_KEY}.csv
                <Download fontSize="small" />
              </Button>
            </CSVLink>
          ) : (
            <Tooltip title="크롤링을 먼저 실행해주세요.">
              <Box>
                <Button fullWidth size="small" disabled>
                  {RECRUITS_ALL_KEY}.csv
                  <Download fontSize="small" />
                </Button>
              </Box>
            </Tooltip>
          )}
          {isCrawling ? (
            <Tooltip title="크롤링 중단">
              <Box>
                <Button variant="contained" color="error" onClick={onClickStop}>
                  STOP
                </Button>
              </Box>
            </Tooltip>
          ) : crawlResults ? (
            <Tooltip title="결과 리셋">
              <Box>
                <Button variant="outlined" onClick={onClickReset} disabled={isCrawling}>
                  RESET
                </Button>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title="크롤링 시작">
              <Box>
                <Button
                  variant="contained"
                  onClick={onClickStart}
                  disabled={isCrawling || selectedPlatforms.length < 1 || serverStatus !== ServerStatus.ONLINE}
                >
                  START
                </Button>
              </Box>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box mb={2}>
        <Collapse in={!!progressLog?.length}>
          <Box
            ref={consoleScrollRef}
            sx={{
              px: 2,
              pb: 3,
              borderRadius: '5px',
              backgroundColor: '#333',
              maxHeight: '300px',
              overflow: 'auto'
            }}
          >
            <pre style={{ color: '#fff', fontSize: 14 }}>{progressLog}</pre>
          </Box>
        </Collapse>
      </Box>
      <Grid container spacing={2}>
        {selectedPlatforms?.length === 0 && (
          <Box width="100%" py={5}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              선택된 플랫폼이 없습니다.
            </Typography>
          </Box>
        )}
        {selectedPlatforms.map((platform) => {
          const platformKey = `${platform}_ALL`
          const platformRes = crawlResults?.[platformKey]

          return (
            <Grid item xs={12} sm={6} key={`selected-platform-${platform}`}>
              <Card
                variant="outlined"
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Box sx={{width: "100%", display: 'flex', alignItems: 'center', justifyContent:"space-between", mb: 1 }}>
                    <Typography  variant="subtitle1" component="div">
                      {platform}
                    </Typography>
                    <Chip
                      label={(selectedCategories[platform] ?? []).length <= MAX_ASYNC_COUNT ? "ASYNC" : "SYNC"}
                      color='default'
                      size='small'

                    />
                  </Box>
                  {(!selectedCategories[platform] ||
                    selectedCategories[platform]?.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      선택된 직무가 없습니다.
                    </Typography>
                  )}
                  {selectedCategories[platform]?.map((cate) => {
                    const catekey = `${platform}_${cate.label}`
                    const cateRes = crawlResults?.[catekey]
                    return cateRes && cateRes.length > 0 ? (
                      <CSVLink
                        key={`${platform}-${cate.value}-label`}
                        filename={catekey}
                        data={cateRes ?? []}
                        headers={selectedFields}
                        style={{
                          width: '100%',
                          textDecoration: 'none'
                        }}
                      >
                        <Chip
                          sx={{ my: 0.5, mr: 0.5 }}
                          label={`${cate.label} (${cateRes.length})`}
                          variant="outlined"
                          icon={getStateIcon(catekey)}
                        />
                      </CSVLink>
                    ) : (
                      <Chip
                        key={`${platform}-${cate.value}-label`}
                        sx={{ my: 0.5, mr: 0.5 }}
                        label={cate.label}
                        variant="outlined"
                        icon={getStateIcon(catekey)}
                      />
                    )
                  })}
                </CardContent>
                <CardActions>
                  {platformRes && platformRes?.length > 0 ? (
                    <CSVLink
                      filename={`${platformKey}.csv`}
                      data={platformRes ?? []}
                      headers={selectedFields}
                      style={{ width: '100%' }}
                    >
                      <Button fullWidth variant="contained" size="small">
                        {platformKey}.csv
                        <Download fontSize="small" />
                      </Button>
                    </CSVLink>
                  ) : (
                    <Button fullWidth variant="contained" size="small" disabled={!platformRes}>
                      {platform}_ALL.csv
                      <Download fontSize="small" />
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Paper>
  )
}

export default ResultSection
