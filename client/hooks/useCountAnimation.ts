import { useEffect, useState } from 'react'

export const useCountAnimation = (target: number, duration: number = 2000, isInView: boolean = false): number => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, isInView])

  return count
}
