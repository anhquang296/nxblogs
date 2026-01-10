'use client'

import React from 'react'
import Giscus from '@giscus/react'
import { useTheme } from 'nextra-theme-blog'

const GiscusComments = () => {
  const { theme } = useTheme()

  return (
    <Giscus
      id="comments"
      repo="aiden296/nxblogs"
      repoId="R_kgDOQ26JqQ"
      category="Announcements"
      categoryId="DIC_kwDOQ26Jqc4C0yiy"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark_tritanopia' : 'light_tritanopia'}
      lang="vi"
      loading="lazy"
    />
  )
}

export default GiscusComments
