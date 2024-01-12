/* eslint-disable consistent-return */
import { getPostsFromWantedByPageAPI } from '../../api/crawlers'
import { type ResultType } from '../types'

const getPostsFromWanted =
  (controller: AbortController) => async (position: string, cateKey: string) => {
    let result: ResultType[] = []
    let page = 0
    let hasNextPage = true

    while (hasNextPage && !controller.signal.aborted) {
      console.log(`Wanted - ${position} - page - ${page}`)
      const pageResult = await getPostsFromWantedByPageAPI(controller)(position, cateKey, page)

      if (pageResult.result.length > 0) {
        result = result.concat(pageResult.result)
      }

      hasNextPage = pageResult.next

      page += 1
    }
    console.log(`Wanted - ${position} - ✅ DONE`)
    return result.sort(
      (a, b) => new Date(b.updatedDate).valueOf() - new Date(a.updatedDate).valueOf()
    )
  }

export default getPostsFromWanted
