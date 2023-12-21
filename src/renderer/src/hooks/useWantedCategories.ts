import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromWanted } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'

const useWantedCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('wanted'),
    async () => {
      const res = await getCategoriesFromWanted()
      return res
    },
    {
      keepPreviousData: true,
      ...options
    }
  )
}

export default useWantedCategories
