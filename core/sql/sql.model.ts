import { EntityManager, Repository } from "typeorm";
import { BaseFunction } from "../base-function-info/base-function-info.model";
import * as uuid from "uuid";

export abstract class QueryBase<T> extends BaseFunction {
	public transactionIdentity?: BaseFunction;
	protected constructor(
		public identity: BaseFunction,
		public repository: Repository<T>,
	) {
		super();
		this.repository = repository;
	}

	public abstract execute(
		transactionManager?: EntityManager,
	): Promise<T>;
}

export class TransactionStart extends BaseFunction {
	public transactionIdentity!: string;
	constructor(public identity: BaseFunction) {
		super();
		this.transactionIdentity = uuid.v4();
	}
}

export class TransactionCommit extends BaseFunction {
	constructor(public identity: BaseFunction) {
		super();
	}
}
