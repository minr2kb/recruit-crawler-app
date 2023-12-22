/* eslint-disable no-alert */
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
  Tooltip,
  Typography
} from '@mui/material'

import { useAtomValue } from 'jotai'
import { useCallback, useState } from 'react'
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
        setCrawlResults((prev) => ({ ...prev, [`${platform}_${cate.label}`]: data }))
        return data
      }) ?? []

    const timeoutId = setTimeout(() => {
      window.alert(
        '15초가 경과했습니다. 만약 개월 수 대비 비정상적으로 오래 걸린다면 새로고침을 해주세요.'
      )
    }, 15 * 1000)

    const results = await Promise.all(promises)
    clearTimeout(timeoutId) // 작업이 완료되면 타이머를 제거합니다.
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
      window.alert('🛑 ERROR OCCURED')
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
              <Button fullWidth size="small" disabled={!crawlResults?.[RECRUITS_ALL_KEY]}>
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
          <Tooltip title="크롤링 시작">
            <Box>
              <Button
                variant="contained"
                onClick={onClickStart}
                disabled={isCrawling || Object.values(selectedCategories).length < 1}
                sx={{ ml: 1 }}
              >
                START
              </Button>
            </Box>
          </Tooltip>
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
        {selectedPlatforms.map((platform) => (
          <Grid item xs={12} sm={6} key={`selected-platform-${platform}`}>
            <Card variant="outlined">
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Typography gutterBottom variant="subtitle1" component="div">
                  {platform}
                </Typography>
                {(!selectedCategories[platform] || selectedCategories[platform]?.length === 0) && (
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
  )
}

export default ResultSection
