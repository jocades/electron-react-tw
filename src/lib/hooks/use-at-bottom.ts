import { useEffect, useState } from 'react'

const useAtBottom = (offset = 0) => {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - offset
      )
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return isAtBottom
}

export default useAtBottom
