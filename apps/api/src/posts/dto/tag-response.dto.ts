export class TagResponseDto {
  id: string;
  name: string;

  constructor(partial: Partial<TagResponseDto>) {
    Object.assign(this, partial);
  }
}
