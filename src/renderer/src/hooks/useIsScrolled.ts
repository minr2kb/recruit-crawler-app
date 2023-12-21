import { useState, useEffect } from 'react'

const useIsScrolled = (): boolean => {
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 0)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return isScrolled
}

export default useIsScrolled
