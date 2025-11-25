import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
  UseGuards,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-cooment.dto';
import { CurrentUser } from '../auth/decorater/get-user.decorater';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateCommentDto })
  async create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    const result = await this.commentsService.create(dto, currentUser);
    return {
      success: true,
      message: 'Comment created successfully',
      data: result,
    };
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
  })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: Number })
  async list(@Param('postId', ParseIntPipe) postId: number) {
    const comments = await this.commentsService.listForPost(postId);
    return {
      success: true,
      data: comments,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({ name: 'id', description: 'ID of the comment', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    const updated = await this.commentsService.update(id, dto, currentUser);
    return {
      success: true,
      message: 'Comment updated successfully',
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment (soft delete)' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({ name: 'id', description: 'ID of the comment', type: Number })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    await this.commentsService.delete(id, currentUser);
    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
}
