import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PostQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  tag?: string;
}
