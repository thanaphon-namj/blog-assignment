import {
  Exclude,
  Expose,
  Transform,
  TransformationType,
  Type,
} from 'class-transformer';
import { TagResponseDto } from './tag-response.dto';

type PostTag = {
  tag?: {
    id: string;
    name: string;
  } | null;
};

type TransformParams = {
  value: TagResponseDto[];
  obj?: {
    tags?: PostTag[];
  };
  type: TransformationType;
};

@Exclude()
export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  postedAt: Date;

  @Expose()
  postedBy: string;

  @Expose()
  @Transform(({ value, obj, type }: TransformParams) => {
    if (type === TransformationType.CLASS_TO_PLAIN) return value;
    return (obj?.tags ?? [])
      .map((postTag) => {
        if (!postTag.tag) return null;
        return new TagResponseDto({
          id: postTag.tag.id,
          name: postTag.tag.name,
        });
      })
      .filter((tag): tag is TagResponseDto => tag !== null);
  })
  tags: TagResponseDto[];

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class PaginationMetaDto {
  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  total: number;

  @Expose()
  totalPages: number;
}

@Exclude()
export class PaginatedPostResponseDto {
  @Expose()
  @Type(() => PostResponseDto)
  posts: PostResponseDto[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
