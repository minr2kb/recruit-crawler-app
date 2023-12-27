/* eslint-disable import/prefer-default-export */
import axios from 'axios'
import { type ResultType } from '../utils/types'
import { BACKEND_URL } from './consts'

export const healthCheck = async () => {
  const res = await axios.get<ResultType[]>(`${BACKEND_URL}/health-check`)
  return res.data
}
