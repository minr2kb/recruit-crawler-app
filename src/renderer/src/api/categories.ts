import axios from 'axios'
import { type CategoryFilterType } from '../utils/types'
import { BACKEND_URL, CATEGORY_PREFIX } from './consts'

export const getCategoriesFromJumpit = async () => {
  try {
    const res = await axios.get<CategoryFilterType[]>(`${BACKEND_URL}/${CATEGORY_PREFIX}/jumpit`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getCategoriesFromProgrammers = async () => {
  try {
    const res = await axios.get<CategoryFilterType[]>(
      `${BACKEND_URL}/${CATEGORY_PREFIX}/programmers`
    )
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

/**
 * @deprecated CloudFlare에서 봇으로 인식하고 차단함
 */
export const getCategoriesFromJobplanet = async () => {
  try {
    const res = await axios.get<CategoryFilterType[]>(`${BACKEND_URL}/${CATEGORY_PREFIX}/jobplanet`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getCategoriesFromWanted = async () => {
  try {
    const res = await axios.get<CategoryFilterType[]>(`${BACKEND_URL}/${CATEGORY_PREFIX}/wanted`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getCategoriesFromRemember = async () => {
  try {
    const res = await axios.get<CategoryFilterType[]>(`${BACKEND_URL}/${CATEGORY_PREFIX}/remember`)
    return res.data
  } catch (e) {
    console.error(e)
    return []
  }
}
