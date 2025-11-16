import React from 'react'
import { useImagePreloader, useIntersectionObserver } from '../hooks/usePerformance'
import { cn } from '../utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  onLoad,
  onError,
}) => {
  const [setImageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  const handleRef = (node: HTMLDivElement | null) => {
    if (node && typeof setImageRef === 'function') {
      setImageRef(node)
    }
  }
  
  const { isLoaded, hasError } = useImagePreloader(isIntersecting ? src : '')

  React.useEffect(() => {
    if (isLoaded) {
      onLoad?.()
    }
  }, [isLoaded, onLoad])

  React.useEffect(() => {
    if (hasError) {
      onError?.()
    }
  }, [hasError, onError])

  return (
    <div ref={handleRef} className={cn('relative overflow-hidden', className)}>
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      ) : (
        <img
          src={isIntersecting ? src : placeholder}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading="lazy"
        />
      )}
    </div>
  )
}

export default LazyImage