import Image from 'next/image'

import { cn } from '@/lib/utils'

interface BorderImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  quality?: number
}

const BorderImage: React.FC<BorderImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  quality
}) => {
  return (
    <div className=" mx-auto max-w-6xl px-6 lg:px-8">
      <div className=" mt-16 flow-root sm:mt-24">
        <div className=" -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              'rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10',
              className
            )}
            quality={quality}
          />
        </div>
      </div>
    </div>
  )
}

export default BorderImage
