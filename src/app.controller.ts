import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Controller()
export class AppController {

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: {
          include: {
            images: true,
            comments: {
              include: {
                user: true,
                replies: true,
                likes: true
              }
            }
          }
        },
        comments: true,
        likes: true
      }
    })
  }

  @Get('userdetails/:id')
  async getUserDetails(@Param('id') id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: {
          include: {
            images: true
          }
        },
        comments: {
          include: {
            post: true
          }
        }
      }
    })
  }

  @Get('users')
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        profile: true,
        posts: true,
        comments: true
      }
    })
  }

  // 👤 Create User
  @Post('user')
  async createUser(@Body() body: any) {
    const { email, name, password } = body

    return await prisma.user.create({
      data: {
        email,
        name,
        password
      }
    })
  }

  // 📝 Create Post
  @Post('post')
  async createPost(@Body() body: any) {
    const { title, userId } = body

    return await prisma.post.create({
      data: {
        title,
        userId
      }
    })
  }

  // 🖼️ Add Post Images
  @Post('post/images')
  async addImages(@Body() body: any) {
    const { postId, images } = body

    return await prisma.postImage.createMany({
      data: images.map((url: string) => ({
        url,
        postId
      }))
    })
  }

  // 💬 Add Comment
  @Post('comment')
  async addComment(@Body() body: any) {
    const { content, postId, userId } = body

    return await prisma.comment.create({
      data: {
        content,
        postId,
        userId
      }
    })
  }

  // 🔁 Reply to Comment
  @Post('comment/reply')
  async reply(@Body() body: any) {
    const { content, postId, userId, parentId } = body

    return await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId
      }
    })
  }

  // ❤️ Like Comment
  @Post('comment/like')
  async like(@Body() body: any) {
    const { userId, commentId } = body

    return await prisma.commentLike.create({
      data: {
        userId,
        commentId
      }
    })
  }

  // 💔 Unlike Comment
  @Delete('comment/unlike')
  async unlike(@Body() body: any) {
    const { userId, commentId } = body

    return await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    })
  }

  // 📥 Get all posts
  @Get('posts')
  async getPosts() {
    return await prisma.post.findMany({
      include: {
        user: true,
        images: true,
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
                likes: true
              }
            },
            likes: true
          }
        }
      }
    })
  }

  // 📄 Get single post
  @Get('post/:id')
  async getPost(@Param('id') id: string) {
    return await prisma.post.findUnique({
      where: { id: id }, // ✅ string id
      include: {
        user: true,
        images: true,
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
                likes: true
              }
            },
            likes: true
          }
        }
      }
    })
  }
}