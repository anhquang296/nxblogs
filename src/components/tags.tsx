import { Badge } from '@/components/ui/badge'
import { Link } from 'next-view-transitions'
import { getTags } from '@/lib/get-tags'

type Props = {
  lang?: string
}

export async function Tags({ lang = 'en' }: Props) {
  const tags = await getTags(lang)

  return (
    <div className="not-prose flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag.name} variant="outline" asChild>
          <Link href={`/tags/${tag.name}`}>
            {tag.name} <span className="opacity-50">({tag.count})</span>
          </Link>
        </Badge>
      ))}
    </div>
  )
}
