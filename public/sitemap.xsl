<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap — Stop Just Coding</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
          h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
          p.desc { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
          p.count { color: #666; margin-bottom: 1rem; font-size: 0.85rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 0.6rem 0.75rem; border-bottom: 2px solid #e5e7eb; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
          td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem; }
          tr:hover td { background: #f9fafb; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .priority { text-align: center; }
          .freq { text-align: center; }
          .langs { display: flex; gap: 0.5rem; }
          .lang-badge { background: #e5e7eb; color: #374151; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.75rem; text-decoration: none; }
          .lang-badge:hover { background: #d1d5db; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <p class="desc">This sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)" /></strong> URLs.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Languages</th>
              <th class="priority">Priority</th>
              <th class="freq">Frequency</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a>
                </td>
                <td>
                  <div class="langs">
                    <xsl:for-each select="xhtml:link[@rel='alternate']">
                      <a class="lang-badge" href="{@href}"><xsl:value-of select="@hreflang" /></a>
                    </xsl:for-each>
                  </div>
                </td>
                <td class="priority"><xsl:value-of select="sitemap:priority" /></td>
                <td class="freq"><xsl:value-of select="sitemap:changefreq" /></td>
                <td><xsl:value-of select="substring(sitemap:lastmod, 1, 10)" /></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
