import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  PostResponseDto,
  PaginatedPostResponseDto,
} from './dto/post-response.dto';
import { TagResponseDto } from './dto/tag-response.dto';

type PostWithTags = Awaited<ReturnType<PostsService['query']>>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private query(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  private toDto(post: NonNullable<PostWithTags>): PostResponseDto {
    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    page: number,
    limit: number,
    tag?: string,
  ): Promise<PaginatedPostResponseDto> {
    limit = Math.min(limit, 50);
    const where: Prisma.PostWhereInput = {};

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          postedAt: 'desc',
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map((post) => this.toDto(post)),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.query(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.toDto(post);
  }

  async findAllTag(): Promise<TagResponseDto[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return tags.map(
      (tag) => new TagResponseDto({ id: tag.id, name: tag.name }),
    );
  }
}
