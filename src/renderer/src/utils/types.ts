export interface ResultType {
  platform: string
  companyName: string
  position: string
  title: string
  updatedDate: string
  recruitUrl: string
  companyLocation: string
}

export interface ResultByPageType {
  result: ResultType[]
  next: boolean
}

export interface CategoryFilterType {
  label: string
  value?: number | string
  children?: CategoryFilterType[]
}

export type TotalResultType = Record<string, ResultType[] | null>
