import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './post.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { QueryPostsDto } from './dto/query.dto';
import { CurrentUser } from '../auth/decorater/get-user.decorater';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // CREATE POST (auth required)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    const post = await this.postsService.create(dto, currentUser);
    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  // LIST all posts (with filters)
  @Get()
  @ApiOperation({ summary: 'List all posts with optional filters' })
  @ApiQuery({ name: 'type', required: false, enum: ['LOST', 'FOUND'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'creatorId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of posts returned' })
  async findAll(@Query() query: QueryPostsDto) {
    const result = await this.postsService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  // LOST posts list
  @Get('lost')
  @ApiOperation({ summary: 'List all LOST posts' })
  @ApiResponse({ status: 200, description: 'List of LOST posts returned' })
  async findLost(@Query() query: QueryPostsDto) {
    const result = await this.postsService.findLost(query);
    return {
      success: true,
      ...result,
    };
  }

  // FOUND posts list
  @Get('found')
  @ApiOperation({ summary: 'List all FOUND posts' })
  @ApiResponse({ status: 200, description: 'List of FOUND posts returned' })
  async findFound(@Query() query: QueryPostsDto) {
    const result = await this.postsService.findFound(query);
    return {
      success: true,
      ...result,
    };
  }

  // GET single post by id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post returned successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    return {
      success: true,
      data: post,
    };
  }

  // UPDATE (only creator)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (only creator)' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    const post = await this.postsService.update(id, dto, currentUser);
    return {
      success: true,
      message: 'Post updated successfully',
      data: post,
    };
  }

  // DELETE (soft delete, only creator)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a post (only creator)' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    await this.postsService.remove(id, currentUser);
    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }
}
