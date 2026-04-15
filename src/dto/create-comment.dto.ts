import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  postId: string

  @IsNotEmpty()
  userId: string

  @IsOptional()
  parentId?: string
}