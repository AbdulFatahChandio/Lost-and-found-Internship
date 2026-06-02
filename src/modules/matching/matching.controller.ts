import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorater/get-user.decorater';
import { MatchQueryDto, UpdateMatchStatusDto } from './dto/match-query.dto';
import { MatchingService } from './matching.service';

@ApiTags('Matches')
@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({
    summary: 'Get potential matches for all LOST posts owned by the current user',
  })
  @ApiResponse({ status: 200, description: 'List of potential matches' })
  async getMyMatches(
    @CurrentUser() currentUser: User,
    @Query() query: MatchQueryDto,
  ) {
    const result = await this.matchingService.getMyMatches(
      currentUser,
      query.status,
    );
    return { success: true, ...result };
  }

  @Get('posts/:postId')
  @ApiOperation({
    summary: 'Get potential matches for a specific LOST or FOUND post',
  })
  @ApiParam({ name: 'postId', type: Number })
  @ApiResponse({ status: 200, description: 'Matches for the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getMatchesForPost(@Param('postId', ParseIntPipe) postId: number) {
    const result = await this.matchingService.getMatchesForPost(postId);
    return { success: true, ...result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':matchId/status')
  @ApiOperation({
    summary: 'Update match status (only the owner of the LOST post)',
  })
  @ApiParam({ name: 'matchId', type: Number })
  async updateMatchStatus(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() dto: UpdateMatchStatusDto,
    @CurrentUser() currentUser: User,
  ) {
    const match = await this.matchingService.updateMatchStatus(
      matchId,
      dto.status,
      currentUser,
    );
    return {
      success: true,
      message: 'Match status updated',
      data: match,
    };
  }
}
