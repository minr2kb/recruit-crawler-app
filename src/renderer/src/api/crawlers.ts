import axios from 'axios'
import { type ResultType } from '../utils/types'
import { BACKEND_URL, CRAWLER_PREFIX } from './consts'

export const getPostsFromJumpit =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jumpit`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromProgrammers =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/programmers`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

/**
 * @deprecated CloudFlare에서 봇으로 인식하고 차단함
 */
export const getPostsFromJobplanet =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jobplanet`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromWanted =
  (controller: AbortController) => async (position: string, cateKey: string) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/wanted`, {
      params: { position, cateKey },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromRemember =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/remember`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }
