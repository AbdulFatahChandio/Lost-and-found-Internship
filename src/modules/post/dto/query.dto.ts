import { IsEnum, IsInt, IsOptional, IsString, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPostsDto {
  @ApiPropertyOptional({
    description: 'Filter posts by type',
    enum: PostType,
    example: PostType.LOST,
  })
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @ApiPropertyOptional({
    description: 'Search term for title or description',
    example: 'wallet',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of posts per page',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter posts by creator ID',
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  creatorId?: number;
}
