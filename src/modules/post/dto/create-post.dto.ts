import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PostType {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Lost Wallet',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Description of the post',
    example: 'Black leather wallet lost near the city park. Contains ID and cards.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of the post (Lost or Found)',
    enum: PostType,
    example: PostType.LOST,
  })
  @IsEnum(PostType)
  type: PostType;
}
