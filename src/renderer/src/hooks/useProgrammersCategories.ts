import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromProgrammers } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'
import { useAtomValue } from 'jotai'
import { serverStatusState } from '../utils/store'
import { ServerStatus } from '../utils/const'

const useProgrammersCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  const serverStatus = useAtomValue(serverStatusState)
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('programmers'),
    async () => {
      const res = await getCategoriesFromProgrammers()

      return res
    },
    {
      keepPreviousData: true,
      enabled: serverStatus=== ServerStatus.ONLINE,
      ...options
    }
  )
}

export default useProgrammersCategories
