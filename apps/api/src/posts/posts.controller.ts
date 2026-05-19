import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  PostResponseDto,
  PaginatedPostResponseDto,
} from './dto/post-response.dto';
import { PostQueryDto } from './dto/post-request.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: PostQueryDto): Promise<PaginatedPostResponseDto> {
    return this.postsService.findAll(query.page, query.limit, query.tag);
  }

  @Get('tags')
  findAllTag(): Promise<TagResponseDto[]> {
    return this.postsService.findAllTag();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postsService.findOne(id);
  }
}
