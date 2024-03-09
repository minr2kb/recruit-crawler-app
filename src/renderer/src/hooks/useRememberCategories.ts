import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { getCategoriesFromRemember } from '../api/categories'
import { ServerStatus } from '../utils/const'
import queryKeys from '../utils/query-keys'
import { serverStatusState } from '../utils/store'
import { type CategoryFilterType } from '../utils/types'

const useRememberCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  const serverStatus = useAtomValue(serverStatusState)
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('remember'),
    async () => {
      const res = await getCategoriesFromRemember()
      return res
    },
    {
      keepPreviousData: true,
      enabled: serverStatus === ServerStatus.ONLINE,
      ...options
    }
  )
}

export default useRememberCategories
