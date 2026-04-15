import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { CreateCommentDto } from './dto/create-comment.dto'

// import { PrismaService } from './prisma/prisma.service'
import { PrismaClient } from '@prisma/client'


@Controller()
export class AppController {
  private prisma = new PrismaClient()
  // constructor(private prisma: PrismaService) {}

  // 🔍 Validate ID
  private isValidId(id: string) {
    return typeof id === 'string' && id.length > 10
  }

  // 👤 Get User
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    try {
      if (!this.isValidId(id)) {
        throw new BadRequestException('Invalid user ID')
      }

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          profile: true,
          posts: {
            select: {
              id: true,
              title: true,
              images: true
            }
          }
        }
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      return user

    } catch (error: unknown) {
      console.error(error)

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message)
      }

      throw new InternalServerErrorException('Failed to fetch user')
    }
  }

  // 📊 User Details
  @Get('userdetails/:id')
  async getUserDetails(@Param('id') id: string) {
    try {
      if (!this.isValidId(id)) {
        throw new BadRequestException('Invalid user ID')
      }

      const user = await this.prisma.user.findUnique({
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

      if (!user) {
        throw new NotFoundException('User not found')
      }

      return user

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to fetch user details')
    }
  }

  // 👥 Get Users (with pagination)
  @Get('users')
  async getUsers(@Query('page') page = '1') {
    try {
      const take = 10
      const skip = (Number(page) - 1) * take

      return await this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true
        }
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to fetch users')
    }
  }

  // 👤 Create User
  @Post('user')
  async createUser(@Body() body: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: body
      })

    } catch (error: unknown) {
      console.error(error)

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message)
      }

      throw new InternalServerErrorException('Failed to create user')
    }
  }

  // 📝 Create Post
  @Post('post')
  async createPost(@Body() body: CreatePostDto) {
    try {
      return await this.prisma.post.create({
        data: body
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to create post')
    }
  }

  // 🖼️ Add Post Images
  @Post('post/images')
  async addImages(@Body() body: { postId: string; images: string[] }) {
    try {
      const { postId, images } = body

      return await this.prisma.postImage.createMany({
        data: images.map((url) => ({
          url,
          postId
        }))
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to add images')
    }
  }

  // 💬 Add Comment / Reply
  @Post('comment')
  async addComment(@Body() body: CreateCommentDto) {
    try {
      return await this.prisma.comment.create({
        data: body
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to add comment')
    }
  }

  // ❤️ Like Comment
  @Post('comment/like')
  async like(@Body() body: { userId: string; commentId: string }) {
    try {
      const { userId, commentId } = body

      return await this.prisma.commentLike.create({
        data: { userId, commentId }
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to like comment')
    }
  }

  // 💔 Unlike Comment
  @Delete('comment/unlike')
  async unlike(@Body() body: { userId: string; commentId: string }) {
    try {
      const { userId, commentId } = body

      return await this.prisma.commentLike.deleteMany({
        where: { userId, commentId }
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to unlike comment')
    }
  }

  // 📥 Get Posts
  @Get('posts')
  async getPosts() {
    try {
      return await this.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              email: true
            }
          },
          images: true
        }
      })

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to fetch posts')
    }
  }

  // 📄 Get Post
  @Get('post/:id')
  async getPost(@Param('id') id: string) {
    try {
      if (!this.isValidId(id)) {
        throw new BadRequestException('Invalid post ID')
      }

      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          user: true,
          images: true,
          comments: {
            include: {
              user: true,
              replies: true,
              likes: true
            }
          }
        }
      })

      if (!post) {
        throw new NotFoundException('Post not found')
      }

      return post

    } catch (error: unknown) {
      console.error(error)
      throw new InternalServerErrorException('Failed to fetch post')
    }
  }
}