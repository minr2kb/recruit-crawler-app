/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */

import axios from 'axios'
import { toStringByFormatting } from '../format'
import { type ResultType } from '../types'
import { isInMonths } from '../validation'

const getUrl = (cateKey: string, pageNum: number) =>
  `https://www.jobplanet.co.kr/api/v3/job/postings?order_by=recent&occupation_level2=${cateKey}&page=${pageNum}&page_size=20`

const getDetailUrl = (id: number) => `https://www.jobplanet.co.kr/api/v1/job/postings/${id}`

const JOBPLANET_BASE_URL = 'https://www.jobplanet.co.kr/job/search?posting_ids%5B%5D='

const COUNT_PER_PAGE = 20

const getPostsFromJobplanet =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const result: ResultType[] = []

    let posts = [...Array(COUNT_PER_PAGE)]
    let page = 1

    while (posts.length === COUNT_PER_PAGE && !controller.signal.aborted) {
      console.log(`Jobplanet - ${position} - page - ${page}`)
      const response = await axios.get(getUrl(cateKey, page), {
        signal: controller.signal
      })
      const { data } = response

      if (data.code !== 200) {
        console.error('ERROR')
        continue
      }
      posts = data.data.recruits
      page += 1

      const promises = posts.map(async (post) => {
        const response = await axios.get(getDetailUrl(post.id), {
          signal: controller.signal
        })
        const { data } = response.data

        if (month && !isInMonths(post.updated_at, month)) return

        const targetData = {
          platform: '잡플래닛',
          companyName: data.name ?? '',
          position,
          title: data.title ?? '',
          updatedDate: toStringByFormatting(new Date(post.updated_at)),
          recruitUrl: post.id ? JOBPLANET_BASE_URL + post.id : '',
          companyLocation: data.location ?? ''
        }
        return targetData
      })
      try {
        const results = await Promise.all(promises)
        results.forEach((data) => {
          if (data) result.push(data)
        })
      } catch (e) {
        window.alert('Jobplanet에서 데이터를 가져오는데 실패했습니다.')
        console.error(e)
      }
    }
    return result.sort(
      (a, b) => new Date(b.updatedDate).valueOf() - new Date(a.updatedDate).valueOf()
    )
  }

export default getPostsFromJobplanet
