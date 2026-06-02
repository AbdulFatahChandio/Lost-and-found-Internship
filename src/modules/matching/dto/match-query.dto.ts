import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MatchStatus } from '@prisma/client';

export class MatchQueryDto {
  @ApiPropertyOptional({ enum: MatchStatus })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}

export class UpdateMatchStatusDto {
  @ApiProperty({ enum: MatchStatus })
  @IsEnum(MatchStatus)
  status: MatchStatus;
}
