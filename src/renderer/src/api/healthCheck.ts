/* eslint-disable import/prefer-default-export */
import axios from 'axios'
import { type ResultType } from '../utils/types'
import { BACKEND_API_URL, BACKEND_URL, CTYPE_API_KEY } from './const'

export const healthCheck = async () => {
  const res = await axios.get<ResultType[]>(`${BACKEND_URL}/health-check`)
  return res.data
}

// export const startServer = async () => {
//   const res = await  axios.put(`${BACKEND_API_URL}/start`, 
//     undefined,
//     {
//       headers:{
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${CTYPE_API_KEY}`,
//         Host: 'api.cloudtype.io',
//         'User-Agent': 'PostmanRuntime/7.26.8',
//       },
//       withCredentials: true
//   })
//   return res.status === 200
// }

export const startServer = async () => {
  const res = await  fetch(`${BACKEND_API_URL}/start`, 
    {
      method: 'PUT',
      headers:{
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${CTYPE_API_KEY}`,
        Host: 'api.cloudtype.io',
        'User-Agent': 'PostmanRuntime/7.26.8',
      },
  })
  return res.status === 200
}

export const stopServer = async () => {
  const res = await axios.put(`${BACKEND_API_URL}/stop`, 
    undefined,
    {
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_API_URL}`
      },
      withCredentials: true
  })
  return res.status === 200
}
