import { JWTPayload } from "@internal/core/auth/auth.model";
import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import {
	ListPostQuery,
	ListPostURL,
} from "@internal/shared/api-interface/post/find-post-interface";
import { PostService } from "./post.service";
import {
	GetPostParam,
	GetPostURL,
} from "@internal/shared/api-interface/post/get-post-interface";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class PostController {
	constructor(private postService: PostService) {}

	@UseGuards(AuthGuard())
	@Get(ListPostURL)
	public async listPost(
		@Query() query: ListPostQuery,
		@Request() user: JWTPayload,
	) {
		return await this.postService.findPostWithPagingAndCondition(
			user.type,
			{
				page: query.page,
				pageSize: query.pageSize,
			},
			query,
		);
	}

	@UseGuards(AuthGuard())
	@Get(GetPostURL)
	public async getPost(
		@Query() params: GetPostParam,
		@Request() _user: JWTPayload,
	) {
		return await this.postService.getPost(params.post_id);
	}
}
