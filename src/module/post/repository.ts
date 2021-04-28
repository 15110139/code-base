import { BaseFunction } from "@internal/core/base-function-info/base-function-info.model";
import { QueryBase } from "@internal/core/base-service/base-sql";
import { HouseEntity } from "@internal/database/entities/house.entity";
import { PeopleEntity } from "@internal/database/entities/people.entity";
import { StreetEntity } from "@internal/database/entities/street.entity";
import { Repository } from "typeorm";

export class CreateStreetQuerySQL extends QueryBase<StreetEntity> {
	constructor(
		public identity: BaseFunction,
		public street: StreetEntity,
		public repository: Repository<StreetEntity>,
	) {
		super(identity, repository);
	}
	public async execute() {
		return await this.repository.save(this.street);
	}
}

export class CreateHouseQuerySQL extends QueryBase<HouseEntity> {
	constructor(
		public identity: BaseFunction,
		public house: HouseEntity,
		public repository: Repository<HouseEntity>,
	) {
		super(identity, repository);
	}
	public async execute() {
		return await this.repository.save(this.house);
	}
}

export class CreatePeopleQuerySQL extends QueryBase<PeopleEntity> {
	constructor(
		public identity: BaseFunction,
		public people: PeopleEntity,
		public repository: Repository<PeopleEntity>,
	) {
		super(identity, repository);
	}

	public execute(): Promise<PeopleEntity> {
		return this.repository.save(this.people);
	}
}
