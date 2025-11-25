import { IsEnum } from 'class-validator';
import { ReactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SetReactionDto {
  @ApiProperty({
    description: 'Type of reaction',
    enum: ReactionType,
    example: ReactionType.LIKE, // or ReactionType.SAD
  })
  @IsEnum(ReactionType)
  type: ReactionType; // LIKE or SAD
}
