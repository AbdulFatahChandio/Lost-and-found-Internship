import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ReactionsService } from './reaction.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetReactionDto } from './dto/set-reaction.dto';
import { CurrentUser } from '../auth/decorater/get-user.decorater';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  // ADD/UPDATE reaction
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':postId')
  @ApiOperation({ summary: 'Add or update a reaction for a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiBody({ type: SetReactionDto })
  @ApiResponse({ status: 200, description: 'Reaction set successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async setReaction(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: SetReactionDto,
    @CurrentUser() currentUser: User,
  ) {
    const reaction = await this.reactionsService.setReaction(
      postId,
      dto,
      currentUser,
    );

    return {
      success: true,
      message: 'Reaction set successfully',
      data: reaction,
    };
  }

  // REMOVE reaction
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':postId')
  @ApiOperation({ summary: 'Remove your reaction from a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Reaction removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeReaction(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() currentUser: User,
  ) {
    await this.reactionsService.removeReaction(postId, currentUser);
    return {
      success: true,
      message: 'Reaction removed successfully',
    };
  }

  // GET reaction info (counts + currentUserReaction)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':postId')
  @ApiOperation({
    summary: 'Get reaction info for a post (counts + current user reaction)',
  })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Reaction info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getReactions(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() currentUser: User,
  ) {
    const info = await this.reactionsService.getReactionsInfo(postId, currentUser);
    return {
      success: true,
      data: info,
    };
  }
}
