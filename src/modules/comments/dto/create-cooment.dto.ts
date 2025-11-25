import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the post to comment on',
    example: 12,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  postId: number;

  @ApiPropertyOptional({
    description: 'ID of the parent comment if this is a reply',
    example: 5,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  parentId?: number;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is my comment on the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
