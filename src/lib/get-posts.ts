import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

type GetPostsOptions = {
  first?: number
  tags?: string[]
  excludeByTitle?: string
  lang?: string
}
export type PostItem = {
  title: string
  name: string
  route: string
  type: string
  frontMatter: {
    title: string
    date: string
    tags: string[]
    description: string
    enableComment: boolean
    filePath: string
    timestamp: number
  }
}

export async function getPosts(options: GetPostsOptions = {}): Promise<PostItem[]> {
  const { first, tags, excludeByTitle, lang = 'en' } = options

  let pageMap

  try {
    pageMap = await getPageMap(`/${lang}/posts`)
  } catch {
    return []
  }

  if (!pageMap || pageMap.length === 0) {
    return []
  }

  const { directories } = normalizePages({
    list: pageMap,
    route: `/${lang}/posts`,
  })

  let posts = directories
    .filter((post) => post.name !== 'index')
    .sort((a, b) => {
      const dateA = new Date(a.frontMatter?.date || '')
      const dateB = new Date(b.frontMatter?.date || '')
      return dateB.getTime() - dateA.getTime()
    })

  if (tags && tags.length > 0) {
    posts = posts.filter((post) => tags.some((tag) => post.frontMatter.tags?.includes(tag)))
  }

  if (excludeByTitle) {
    posts = posts.filter((post) => post.title !== excludeByTitle)
  }

  if (first) {
    posts = posts.slice(0, first)
  }

  return posts as unknown as PostItem[]
}
