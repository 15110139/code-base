import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "@internal/database/entities/post.entity";
import {
	IPaginationOptions,
	paginate,
} from "nestjs-typeorm-paginate";
import { FindManyOptions, Repository } from "typeorm";

@Injectable()
export class PostRepository {
	constructor(
		@InjectRepository(PostEntity)
		private readonly postRepo: Repository<PostEntity>,
	) {}

	public async createPost(post: PostEntity) {
		return await this.postRepo.save(post);
	}

	public async findPostWithCondition(condition: FindManyOptions<PostEntity>) {
		return await this.postRepo.find(condition);
	}

	public async getPostWithCondition(condition: Partial<PostEntity>) {
		return await this.postRepo.findOne(condition);
	}

	public async pagingWithCondition(
		options: IPaginationOptions,
		condition: FindManyOptions<PostEntity>,
	) {
		const result = await paginate<PostEntity>(
			this.postRepo,
			options,
			condition,
		);

		return {
			data: result.items,
			currentPage: options.page,
			pageSize: options.limit,
		};
	}
}
