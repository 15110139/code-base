import { Exclude, Expose, Type } from "class-transformer";
import {
	IsBoolean,
	IsDate,
	IsOptional,
	IsString,
} from "class-validator";
import { PagingRequest, PagingResponse } from "../paging-interface";
import { PostItem } from "./post.model";

@Exclude()
export class ListPostQuery extends PagingRequest {
	@IsDate()
	@Type((_type: unknown) => Date)
	@Expose()
	@IsOptional()
	public start_have_seen_at?: Date;

	@IsDate()
	@Type((_type: unknown) => Date)
	@Expose()
	@IsOptional()
	public end_have_end_at?: Date;

	@IsBoolean()
	@Type((_type: unknown) => Boolean)
	@IsOptional()
	is_image?: boolean;

	@IsBoolean()
	@Type((_type: unknown) => Boolean)
	@IsOptional()
	public is_video?: boolean;

	@IsDate()
	@Type((_type: unknown) => Date)
	@Expose()
	@IsOptional()
	public start_create_at?: Date;

	@IsDate()
	@Type((_type: unknown) => Date)
	@Expose()
	@IsOptional()
	public end_create_at?: Date;

	@IsString()
	@IsOptional()
	@Expose()
	public product_class?: string;

	@Expose()
	@IsOptional()
	public sort?: string;
}

export class ListPostResponse extends PagingResponse<PostItem> {
	constructor(
		data: PostItem[],
		currentPage: number,
		totalItems: number,
		pageSize?: number,
	) {
		super(data, currentPage, totalItems, pageSize);
	}
}

export const ListPostURL = "/post";
