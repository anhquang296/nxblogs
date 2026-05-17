import { Folder, MdxFile, Meta, MetaJsonFile, PageMapItem } from 'nextra'
import { getPageMap } from 'nextra/page-map'

export const dynamic = 'force-static'

const BASE_URL = 'https://stopjustcoding.com'
const LOCALES = ['en', 'vi']

interface SitemapEntry {
  url: string
  lastModified: string
}

const isMetaJsonFile = (value: unknown): value is MetaJsonFile =>
  typeof value === 'object' && value !== null && 'data' in value

const isFolder = (value: unknown): value is Folder =>
  typeof value === 'object' && value !== null && 'name' in value && 'route' in value && 'children' in value

const isMdxFile = (value: unknown): value is MdxFile =>
  typeof value === 'object' && value !== null && 'name' in value && 'route' in value && 'frontMatter' in value

const isPageHidden = (name: string, metaData: Record<string, Meta>): boolean => {
  const metaEntry = metaData[name]

  if (typeof metaEntry === 'object' && metaEntry !== null && 'display' in metaEntry) {
    return metaEntry.display === 'hidden'
  }

  const wildcardEntry = metaData['*']
  if (typeof wildcardEntry === 'object' && wildcardEntry !== null && 'display' in wildcardEntry) {
    return wildcardEntry.display === 'hidden'
  }

  return false
}

const toSitemapEntry = (pageMapEntry: PageMapItem, metaData: Record<string, Meta> = {}): SitemapEntry[] => {
  if (isFolder(pageMapEntry)) {
    if (isPageHidden(pageMapEntry.name, metaData)) {
      return []
    }
    return parsePageMapItems(pageMapEntry.children)
  } else if (isMdxFile(pageMapEntry)) {
    if (isPageHidden(pageMapEntry.name, metaData)) {
      return []
    }

    const { frontMatter, route } = pageMapEntry

    return [
      {
        url: route,
        lastModified: frontMatter?.timestamp ? new Date(frontMatter.timestamp).toISOString() : new Date().toISOString(),
      },
    ]
  }

  return []
}

const parsePageMapItems = (items: PageMapItem[]): SitemapEntry[] => {
  const metaFile = items.find((item) => isMetaJsonFile(item))
  const metaData = (metaFile as MetaJsonFile | undefined)?.data ?? {}

  return items
    .filter((item) => !isMetaJsonFile(item))
    .flatMap((pageMapEntry) => toSitemapEntry(pageMapEntry, metaData))
}

const escapeXml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const routeTimestamps = new Map<string, string>()

  for (const locale of LOCALES) {
    try {
      const pageMap = await getPageMap(`/${locale}`)
      const entries = parsePageMapItems(pageMap)
      for (const entry of entries) {
        const existing = routeTimestamps.get(entry.url)
        if (!existing || entry.lastModified > existing) {
          routeTimestamps.set(entry.url, entry.lastModified)
        }
      }
    } catch {
      // locale has no content yet
    }
  }

  const TOOL_ROUTES = ['/tools/browser-event-loop-visualizer', '/tools/nodejs-event-loop-visualizer']

  const localizedUrls = Array.from(routeTimestamps.entries())
    .filter(([route]) => !route.startsWith('/tools'))
    .flatMap(([route, lastModified]) => {
      const alternates = LOCALES.map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(`${BASE_URL}/${locale}${route}`)}" />`
      ).join('\n')

      return LOCALES.map(
        (locale) => `  <url>
    <loc>${escapeXml(`${BASE_URL}/${locale}${route}`)}</loc>
${alternates}
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
      )
    })
    .join('\n')

  const toolUrls = TOOL_ROUTES.map(
    (route) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${route}`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n')

  const urls = [localizedUrls, toolUrls].filter(Boolean).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
