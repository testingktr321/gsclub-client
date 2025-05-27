import Blog from '@/components/Blog/Blog'
import { prisma } from '@/lib/prisma'
import React from 'react'

export const dynamic = 'force-dynamic'

const page = async () => {
  const articles = await prisma.blogArticle.findMany({
    include: {
      images: true,
    }
  })

  return (
    <div >
      <Blog articles={articles} />
    </div>
  )
}

export default page
