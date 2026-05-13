import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  readingTime: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        light: 'one-dark-pro',
        dark: 'one-dark-pro',
      },
    },
  },
})

// You can include other Next.js configuration options here, in addition to Nextra settings:
export default withNextra({
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
})