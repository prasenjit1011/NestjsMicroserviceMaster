import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 👤 Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John',
      password: '123456'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: '123456'
    }
  })

  // 📝 Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'Hello World',
      userId: user1.id
    }
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Second Post',
      content: 'NestJS + Prisma 🚀',
      userId: user2.id
    }
  })

  // 🖼️ Post Images
  await prisma.postImage.createMany({
    data: [
      { url: 'img1.jpg', postId: post1.id },
      { url: 'img2.jpg', postId: post1.id },
      { url: 'img3.jpg', postId: post2.id }
    ]
  })

  // 💬 Comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Nice post!',
      postId: post1.id,
      userId: user2.id
    }
  })

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Thanks!',
      postId: post1.id,
      userId: user1.id,
      parentId: comment1.id // reply
    }
  })

  // ❤️ Likes
  await prisma.commentLike.create({
    data: {
      userId: user1.id,
      commentId: comment1.id
    }
  })

  await prisma.commentLike.create({
    data: {
      userId: user2.id,
      commentId: comment2.id
    }
  })

  console.log('✅ Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })