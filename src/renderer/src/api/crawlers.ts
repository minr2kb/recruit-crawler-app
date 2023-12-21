import axios from 'axios'
import { type ResultType } from '../utils/types'
import { BACKEND_URL, CRAWLER_PREFIX } from './consts'

export const getPostsFromJumpit = async (position: string, cateKey: string, month?: number) => {
  try {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jumpit`, {
      params: { position, cateKey, month }
    })
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getPostsFromProgrammers = async (
  position: string,
  cateKey: string,
  month?: number
) => {
  try {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/programmers`, {
      params: { position, cateKey, month }
    })
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

/**
 * @deprecated CloudFlare에서 봇으로 인식하고 차단함
 */
export const getPostsFromJobplanet = async (position: string, cateKey: string, month?: number) => {
  try {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/jobplanet`, {
      params: { position, cateKey, month }
    })
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getPostsFromWanted = async (position: string, cateKey: string) => {
  try {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/wanted`, {
      params: { position, cateKey }
    })
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getPostsFromRemember = async (position: string, cateKey: string, month?: number) => {
  try {
    const res = await axios.get<ResultType[]>(`${BACKEND_URL}/${CRAWLER_PREFIX}/remember`, {
      params: { position, cateKey, month }
    })
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}
