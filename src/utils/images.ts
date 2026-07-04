import type { SyntheticEvent } from 'react'

export const fallbackImageSrc = `${import.meta.env.BASE_URL}Images/logoCuki2.png`

export function handleImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  if (event.currentTarget.src === fallbackImageSrc) {
    return
  }

  event.currentTarget.src = fallbackImageSrc
}
