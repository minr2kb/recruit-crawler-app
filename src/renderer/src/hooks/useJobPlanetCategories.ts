import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import axios, { HttpStatusCode } from 'axios'
import { useAtomValue } from 'jotai'
import { ServerStatus } from '../utils/const'
import queryKeys from '../utils/query-keys'
import { serverStatusState } from '../utils/store'
import { type CategoryFilterType } from '../utils/types'

export interface JobplanetCateDataType {
  label: string
  name: string
  type?: string
  value?: number
  data: JobplanetCateDataType[]
}

export interface JobplanetCateResponseType {
  status: string
  code: number
  data: Record<string, JobplanetCateDataType[]>
}

export const JOBPLANET_CATE_URL =
  'https://www.jobplanet.co.kr/api/v1/common/wizard/meta_info?fields=display_filters'

const useJobPlanetCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  const serverStatus = useAtomValue(serverStatusState)
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('jobplanet'),
    async () => {
      const response = await axios.get<JobplanetCateResponseType>(JOBPLANET_CATE_URL)

      let res: CategoryFilterType[] = []
      if (response.data.code === HttpStatusCode.Ok) {
        const cates = response.data.data.display_filters[0].data
        res = cates?.map((cate) => ({
          label: cate.label,
          children: cate.data.map((childCate) => ({
            label: childCate.label,
            value: childCate.label.includes('전체') ? cate.value : childCate.value
          }))
        }))
      }
      return res
    },
    {
      keepPreviousData: true,
      enabled: serverStatus === ServerStatus.ONLINE,
      ...options
    }
  )
}

export default useJobPlanetCategories
