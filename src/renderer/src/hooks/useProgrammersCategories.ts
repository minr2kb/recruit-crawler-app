import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesFromProgrammers } from '../api/categories'
import queryKeys from '../utils/query-keys'
import { type CategoryFilterType } from '../utils/types'

const useProgrammersCategories = ({
  options
}: {
  options?: Omit<UseQueryOptions<CategoryFilterType[]>, 'queryFn' | 'queryKey'>
} = {}) => {
  return useQuery<CategoryFilterType[]>(
    queryKeys.CATEGORIES('programmers'),
    async () => {
      const res = await getCategoriesFromProgrammers()

      return res
    },
    {
      keepPreviousData: true,
      ...options
    }
  )
}

export default useProgrammersCategories
