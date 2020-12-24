import { BaseFunction } from "@internal/core/base-function-info/base-function-info.model";
import { HandlerFunction } from "@internal/core/base-service/base-service.decorator";
import { BaseApplication } from "@internal/core/base-service/base-service.model";
import { PeopleEntity } from "@internal/database/entities/people.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePeopleQuerySQL } from "../repository";

export class CreateUserCaseService extends BaseApplication {
	constructor(
		@InjectRepository(PeopleEntity)
		private peopleRepo: Repository<PeopleEntity>,
	) {
		super();
	}
	@HandlerFunction()
	public async execute(
		identity: BaseFunction,
		houseId: string,
	): Promise<PeopleEntity> {
		await this.sqlBase.startTransaction(identity);

		const newPeople = new PeopleEntity();
		newPeople.name = "Tien";
		newPeople.house_id = houseId;

		const people = await this.sqlBase.executeQuery<PeopleEntity>(
			new CreatePeopleQuerySQL(identity, newPeople, this.peopleRepo),
		);

		await this.sqlBase.commitTransaction(identity);
		return people;
	}
}
