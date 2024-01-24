import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromJumpit } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'
import { useAtomValue } from 'jotai'
import { serverStatusState } from '../utils/store'
import { ServerStatus } from '../utils/const'

const useJumpitCategories = ({
  options
}: {
  options?: Omit<
    UseQueryOptions<CategoryFilterType[], unknown, CategoryFilterType[], QueryKey>,
    'queryFn' | 'queryKey'
  >
} = {}) => {
  const serverStatus = useAtomValue(serverStatusState)
  return useQuery<CategoryFilterType[], unknown, CategoryFilterType[]>(
    queryKeys.CATEGORIES('jumpit'),
    async () => {
      const res = await getCategoriesFromJumpit()
      return res
    },
    {
      keepPreviousData: true,
      enabled: serverStatus === ServerStatus.ONLINE,
      ...options
    }
  )
}

export default useJumpitCategories
