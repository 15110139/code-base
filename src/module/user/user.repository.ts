import { UserEntity } from '@internal/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

export class UserRepository {
	constructor(
		@InjectRepository(UserEntity) private repo: Repository<UserEntity>,
	) {}
	public async create(user: UserEntity) {
		return await this.repo.save(user);
	}
	public async update(
		condition: Partial<UserEntity>,
		dataUpdate: Partial<UserEntity>,
	) {
		await this.repo.update(condition, dataUpdate);
		return this.repo.findOne(condition);
	}

	public async get(condition: Partial<UserEntity>) {
		return this.repo.findOne(condition);
	}

	public async find(condition: FindManyOptions<UserEntity>) {
		return this.repo.find(condition);
	}

	public async hardDelete(condition: Partial<UserEntity>) {
		await this.repo.delete(condition);
	}
}
