import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromJumpit } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'

const useJumpitCategories = ({
  options
}: {
  options?: Omit<
    UseQueryOptions<CategoryFilterType[], unknown, CategoryFilterType[], QueryKey>,
    'queryFn' | 'queryKey'
  >
} = {}) => {
  return useQuery<CategoryFilterType[], unknown, CategoryFilterType[]>(
    queryKeys.CATEGORIES('jumpit'),
    async () => {
      const res = await getCategoriesFromJumpit()
      return res
    },
    {
      keepPreviousData: true,
      ...options
    }
  )
}

export default useJumpitCategories
