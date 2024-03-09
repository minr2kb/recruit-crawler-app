/* eslint-disable consistent-return */
import { getPostsFromJobKoreaByPageAPI } from '../../api/crawlers'
import { type ResultType } from '../types'

const getPostsFromJobKorea =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    let result: ResultType[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage && !controller.signal.aborted) {
      console.log(`JobKorea - ${position} - page - ${page}`)
      const pageResult = await getPostsFromJobKoreaByPageAPI(controller)(
        position,
        cateKey,
        page,
        month
      )

      result = result.concat(pageResult.result)
      hasNextPage = pageResult.next

      page += 1
    }
    console.log(`JobKorea - ${position} - ✅ DONE`)
    return result.sort(
      (a, b) => new Date(b.updatedDate).valueOf() - new Date(a.updatedDate).valueOf()
    )
  }

export default getPostsFromJobKorea
