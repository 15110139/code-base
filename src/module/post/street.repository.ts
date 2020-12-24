import { Injectable } from "@nestjs/common";
import { StreetEntity } from "@internal/database/entities/street.entity";
import {
	IPaginationOptions,
	paginate,
} from "nestjs-typeorm-paginate";
import { FindManyOptions, Repository } from "typeorm";

@Injectable()
export class StreetRepository {


	public async createStreet(street: StreetEntity,streetRepo:Repository<StreetEntity>) {
		return await streetRepo.save(street);
	}

	public async findStreetWithCondition(condition: FindManyOptions<StreetEntity>,streetRepo:Repository<StreetEntity>) {
		return await streetRepo.find(condition);
	}

	public async getStreetWithCondition(condition: Partial<StreetEntity>,streetRepo:Repository<StreetEntity>) {
		return await streetRepo.findOne(condition);
	}

	public async pagingWithCondition(
		options: IPaginationOptions,
        condition: FindManyOptions<StreetEntity>,
        streetRepo:Repository<StreetEntity>
	) {
		const result = await paginate<StreetEntity>(
			streetRepo,
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
