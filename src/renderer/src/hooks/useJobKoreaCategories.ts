import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { getCategoriesFromJobkorea } from '../api/categories'
import { ServerStatus } from '../utils/const'
import queryKeys from '../utils/query-keys'
import { serverStatusState } from '../utils/store'
import { type CategoryFilterType } from '../utils/types'

const useJobKoreaCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  const serverStatus = useAtomValue(serverStatusState)
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('jobkorea'),
    async () => {
      const res = await getCategoriesFromJobkorea()
      return res
    },
    {
      keepPreviousData: true,
      enabled: serverStatus === ServerStatus.ONLINE,
      ...options
    }
  )
}

export default useJobKoreaCategories
