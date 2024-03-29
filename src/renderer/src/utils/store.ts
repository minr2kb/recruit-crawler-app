import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { ServerStatus, headerFields, type Platforms } from './const'
import { type CategoryFilterType } from './types'

export const serverStatusState = atom<ServerStatus>(ServerStatus.STARTING)

export const selectedCategoriesState = atomWithStorage<
  Partial<Record<Platforms, CategoryFilterType[]>>
>('sel_categories', {})

export const selectedPlatformsState = atomWithStorage<Platforms[]>('sel_platforms', [])

export const selectedFieldsState = atomWithStorage<Array<{ label: string; key: string }>>(
  'sel_fields',
  Object.entries(headerFields).map(([k, v]) => ({ label: v, key: k }))
)

export const limitMonthsState = atomWithStorage<number>('sel_months', 3)

export const progressLogState = atom<string | undefined>('')

export const isCrawlingState = atom<boolean>(false)
