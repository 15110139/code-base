import { Injectable } from "@nestjs/common";
import { PostEntity } from "@internal/database/entities/post.entity";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import { FindManyOptions, Repository } from "typeorm";

@Injectable()
export class PostRepository {
	public async createPost(
		post: PostEntity,
		postRepo: Repository<PostEntity>,
	) {
		return await postRepo.save(post);
	}

	public async findPostWithCondition(
		condition: FindManyOptions<PostEntity>,
		postRepo: Repository<PostEntity>,
	) {
		return await postRepo.find(condition);
	}

	public async getPostWithCondition(
		condition: Partial<PostEntity>,
		postRepo: Repository<PostEntity>,
	) {
		return await postRepo.findOne(condition);
	}

	public async pagingWithCondition(
		options: IPaginationOptions,
		condition: FindManyOptions<PostEntity>,
		postRepo: Repository<PostEntity>,
	) {
		const result = await paginate<PostEntity>(postRepo, options, condition);

		return {
			data: result.items,
			currentPage: options.page,
			pageSize: options.limit,
		};
	}
}
