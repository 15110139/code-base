import { EnvironmentsService } from "@internal/core/environment/environment.service";
import { PostEntity } from "@internal/database/entities/post.entity";
import { ListPostQuery } from "@internal/shared/api-interface/post/find-post-interface";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Between, FindConditions } from "typeorm";
import { PostRepository } from "./post.reposiotry";

@Injectable()
export class PostService {
	constructor(
		private postRepo: PostRepository,
		private envService: EnvironmentsService,
	) {}

	public async findPostWithPagingAndCondition(
		userType: TOKEN_TYPE,
		paging: {
			page: number;
			pageSize: number;
		},
		query: ListPostQuery,
	) {
		const filter = this.generateFilter(query);
		const sort = this.generateSort(query.sort);
		if (userType === TOKEN_TYPE.NORMAL) {
			const optionPaging = this.generateDataQueryWithNormalUser(
				paging.pageSize,
				paging.page,
			);

			return optionPaging.isQuery
				? await this.postRepo.pagingWithCondition(
						{
							limit: optionPaging.limit,
							page: paging.page,
						},
						{
							where: filter,
							order: sort,
						},
				  )
				: {
						data: [],
						totalItem: this.envService.ENVIRONMENTS
							.LIMIT_POST_NORMAL,
						currentPage: paging.page,
						pageSize: 0,
				  };
		} else {
			return await this.postRepo.pagingWithCondition(
				{
					page: paging.page,
					limit: paging.pageSize,
				},
				{
					where: filter,
					order: sort,
				},
			);
		}
	}

	public async getPost(postId: string) {
		const post = await this.postRepo.getPostWithCondition({
			post_id: postId,
		});
		if (!post) {
			throw new BadRequestException(SYSTEM_CODE.POST_NOT_FOUND);
		}
		return post;
	}

	private generateFilter(filterData: ListPostQuery) {
		const condition: FindConditions<PostEntity> = {
			have_seen_at: Between<Date>(
				filterData.start_have_seen_at || new Date("1970-01-01"),
				filterData.end_have_end_at || new Date(),
			),
			create_at: Between<Date>(
				filterData.start_create_at || new Date("1970-01-01"),
				filterData.end_create_at || new Date(),
			),
		};
		if (filterData.product_class) {
			condition.product_class = filterData.product_class;
		}
		if (filterData.is_image) {
			condition.is_image = filterData.is_image;
		}

		if (filterData.is_video) {
			condition.is_video = filterData.is_video;
		}
		return condition;
	}

	private generateSort(sort: string) {
		if (!sort || sort.length === 0) {
			return null;
		}
		const listArray = sort.split(",");
		const ObjectSort: any = {};
		listArray.forEach((el: string) => {
			const [property, sortType] = el.split(":");
			if (checkValidPrefix(sortType) && checkValidProperty(property))
				ObjectSort[property] = sortType;
		});

		function checkValidPrefix(prefix) {
			console.log("prefix", prefix);

			const constantPrefix = ["ASC", "DESC", 1, -1, "1", "-1"];
			if (!prefix) {
				return false;
			}

			if (!constantPrefix.includes(prefix)) {
				return false;
			}
			return true;
		}

		function checkValidProperty(property) {
			if (!property) {
				return false;
			}
			const listProperty = [
				"post_id",
				"likes",
				"comments",
				"shares",
				"description",
				"call_to_action_url",
				"image_url",
				"facebook_account_id",
				"have_seen_at",
				"description_url",
				"is_image",
				"is_video",
				"is_activated",
				"genre_id",
				"interaction",
				"page_name",
				"page_picture",
				"page_id",
				"last_seen_at",
				"country",
				"ecom_platform_id",
				"product_class",
			];
			if (!listProperty.includes(property)) {
				return false;
			}

			return true;
		}
	}

	private generateDataQueryWithNormalUser(pageSize: number, page: number) {
		const skip = page * pageSize;
		if (skip >= this.envService.ENVIRONMENTS.LIMIT_POST_NORMAL) {
			const limitRemaining =
				skip -
				this.envService.ENVIRONMENTS.LIMIT_POST_NORMAL / pageSize;
			if (limitRemaining / pageSize > 1) {
				return {
					isQuery: false,
					limit: null,
				};
			} else {
				return { isQuery: true, limit: limitRemaining };
			}
		} else {
			return {
				isQuery: true,
				limit: pageSize,
			};
		}
	}
}
