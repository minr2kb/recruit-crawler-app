import { useMediaQuery } from '@mui/material'
import {
  desktopWidthMediaQuery,
  mobileMaxWidthMediaQuery,
  tabletMaxWidthMediaQuery
} from '../utils/mediaQueries'

const useMediaQueries = () => {
  const isMobile = useMediaQuery(mobileMaxWidthMediaQuery)
  const isTablet = useMediaQuery(tabletMaxWidthMediaQuery)
  const isDesktop = useMediaQuery(desktopWidthMediaQuery)
  return { isMobile, isTablet, isDesktop }
}

export default useMediaQueries
