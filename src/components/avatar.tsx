import * as React from 'react'

type Props = {
  src: string
  alt?: string
  size?: number
}

export function Avatar({ src, alt = 'Avatar', size = 60 }: Props) {
  return (
    <div className="flex items-center justify-start">
      <img
        src={src}
        alt={alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'inline',
          margin: 0,
        }}
      />
    </div>
  )
}
