import { getPosts } from '@/lib/get-posts'

export type TagItem = {
  name: string
  count: number
}

export async function getTags(lang: string = 'en'): Promise<TagItem[]> {
  const posts = await getPosts({ lang })
  const tags: string[] = posts.flatMap((post) => post.frontMatter?.tags || [])

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count,
  }))
}
