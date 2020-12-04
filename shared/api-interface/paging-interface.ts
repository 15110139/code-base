import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PagingResponse<T> {
  @IsArray()
  @Expose()
  public list: T[];

  @IsNumber()
  @Expose()
  public currentPage: number;

  @IsNumber()
  @Expose()
  public totalPages: number;

  constructor(
    data: T[],
    currentPage: number,
    totalItems: number,
    pageSize?: number,
  ) {
    this.list = data;
    this.currentPage = pageSize && pageSize > 0 ? currentPage : 1;
    this.totalPages =
      pageSize && pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
  }
}

@Exclude()
export class PagingRequest {
  @IsNumber()
  @Type((_type: unknown) => Number)
  @Expose()
  @IsOptional()
  public page: number;

  @IsNumber()
  @Type((_type: unknown) => Number)
  @Expose()
  @IsOptional()
  public pageSize: number;

  public get skip(): number {
    if (!this.pageSize) {
      return 0;
    }
    return (this.page - 1) * this.pageSize;
  }

  constructor(page?: number, pageSize?: number) {
    this.page = page || 1;
    this.pageSize = pageSize || 10;
  }
}
