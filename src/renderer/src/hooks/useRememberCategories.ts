import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromRemember } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'
import { serverStatusState } from '../utils/store'
import { useAtomValue } from 'jotai'
import { ServerStatus } from '../utils/const'

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
