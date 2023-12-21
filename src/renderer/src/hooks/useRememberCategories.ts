import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromRemember } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'

const useRememberCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('remember'),
    async () => {
      const res = await getCategoriesFromRemember()
      return res
    },
    {
      keepPreviousData: true,
      ...options
    }
  )
}

export default useRememberCategories
