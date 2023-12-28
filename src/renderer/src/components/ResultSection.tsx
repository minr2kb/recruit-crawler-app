/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import { Check, DataArray, Download, Error } from '@mui/icons-material'
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
  Tooltip,
  Typography
} from '@mui/material'

import { useAtomValue } from 'jotai'
import { useCallback, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'

import {
  getPostsFromJumpit,
  getPostsFromProgrammers,
  getPostsFromRemember,
  getPostsFromWanted
} from '../api/crawlers'
import { Platforms } from '../utils/const'
import getPostsFromJobplanet from '../utils/crawlers/jobplanet'
import {
  limitMonthsState,
  selectedCategoriesState,
  selectedFieldsState,
  selectedPlatformsState
} from '../utils/store'
import { type ResultType, type TotalResultType } from '../utils/types'

const RECRUITS_ALL_KEY = 'RECRUITS_ALL'

function ResultSection() {
  const selectedPlatforms = useAtomValue(selectedPlatformsState)
  const selectedCategories = useAtomValue(selectedCategoriesState)
  const selectedFields = useAtomValue(selectedFieldsState)
  const limitMonths = useAtomValue(limitMonthsState)

  const controllerRef = useRef<AbortController>()

  const [crawlResults, setCrawlResults] = useState<TotalResultType>()
  const [isCrawling, setIsCrawling] = useState<boolean>(false)

  const getFunc = (
    platform: Platforms,
    controller: AbortController
  ): ((position: string, cateKey: string, month?: number) => Promise<ResultType[]>) => {
    switch (platform) {
      case Platforms.JUMPIT:
        return getPostsFromJumpit(controller)
      case Platforms.PROGRAMMERS:
        return getPostsFromProgrammers(controller)
      case Platforms.JOBPLANET:
        return getPostsFromJobplanet(controller)
      case Platforms.WANTED:
        return getPostsFromWanted(controller)
      case Platforms.REMEMBER:
        return getPostsFromRemember(controller)
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

    if (selectedCategory && selectedCategory.length <= 3) {
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
      console.time('⏱️ Total time spent')
      console.log('\n\n####### 🚗 Initializing 🚗 #######\n\n')
      setIsCrawling(true)
      setCrawlResults({})
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

      console.log('\n\n####### ✨ Done ✨ #######\n\n')
      console.timeLog('⏱️ Total time spent')
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
                sx={{ mr: 1 }}
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
                  disabled={isCrawling || selectedPlatforms.length < 1}
                >
                  START
                </Button>
              </Box>
            </Tooltip>
          )}
        </Box>
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
