import axios from 'axios'
import { type ResultByPageType, type ResultType } from '../utils/types'
import { BACKEND_URL, CRAWLER_PREFIX } from './const'

/**
 * @deprecated CloudFlare에서 봇으로 인식하고 차단함
 */
export const getPostsFromJobplanetAPI =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jobplanet`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromJumpitAPI =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jumpit`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromJumpitByPageAPI =
  (controller: AbortController) =>
  async (position: string, cateKey: string, page: number, month?: number) => {
    const res = await axios.get<ResultByPageType>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jumpit`, {
      params: { position, cateKey, page, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromProgrammersAPI =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/programmers`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromProgrammersByPageAPI =
  (controller: AbortController) =>
  async (position: string, cateKey: string, page: number, month?: number) => {
    const res = await axios.get<ResultByPageType>(`${BACKEND_URL}/${CRAWLER_PREFIX}/programmers`, {
      params: { position, cateKey, page, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromRememberAPI =
  (controller: AbortController) => async (position: string, cateKey: string, month?: number) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/remember`, {
      params: { position, cateKey, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromRememberByPageAPI =
  (controller: AbortController) =>
  async (position: string, cateKey: string, page: number, month?: number) => {
    const res = await axios.get<ResultByPageType>(`${BACKEND_URL}/${CRAWLER_PREFIX}/remember`, {
      params: { position, cateKey, page, month },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromWantedAPI =
  (controller: AbortController) => async (position: string, cateKey: string) => {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/wanted`, {
      params: { position, cateKey },
      signal: controller.signal
    })
    return res.data
  }

export const getPostsFromWantedByPageAPI =
  (controller: AbortController) => async (position: string, cateKey: string, page: number) => {
    const res = await axios.get<ResultByPageType>(`${BACKEND_URL}/${CRAWLER_PREFIX}/wanted`, {
      params: { position, cateKey, page },
      signal: controller.signal
    })
    return res.data
  }
