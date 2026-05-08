import type { Metadata } from 'next'
import { getTags } from '@/lib/get-tags'
import { Posts } from '@/components/posts'
import { Tags } from '@/components/tags'

type TagPageParams = {
  lang: string
  tag: string
}

type TagPageProps = {
  params: Promise<TagPageParams>
}

const LOCALES = ['en', 'vi']

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params
  return {
    title: `Posts Tagged with "${decodeURIComponent(params.tag)}"`,
  }
}

export async function generateStaticParams(): Promise<TagPageParams[]> {
  const results: TagPageParams[] = []
  for (const lang of LOCALES) {
    try {
      const allTags = await getTags(lang)
      for (const item of allTags) {
        results.push({ lang, tag: item.name })
      }
    } catch {
      // No posts for this locale yet
    }
  }
  return results
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params
  const decodedTag = decodeURIComponent(params.tag)

  return (
    <>
      <h1>
        {params.lang === 'en' ? 'Posts Tagged with' : 'Thẻ'} &quot;{decodedTag}&quot;
      </h1>
      <Posts tags={[decodedTag]} lang={params.lang} />

      <h2>{params.lang === 'en' ? 'More tags' : 'Các thẻ khác'}</h2>
      <Tags lang={params.lang} />
    </>
  )
}
