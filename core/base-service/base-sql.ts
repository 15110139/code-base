import { BaseFunction } from "../base-function-info/base-function-info.model";
import { EntityManager, QueryRunner, Repository } from "typeorm";
import * as uuid from "uuid";

export type TransactionMap = Map<BaseFunction, TransactionData>;

export type TransactionData = {
	count: number;
	callBlackReleaseLock: Array<() => Promise<void>>;
	queryRunner: QueryRunner;
	managerTransaction: EntityManager;
};
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


export abstract class SqlBase {
	protected abstract startTransaction(f: BaseFunction): Promise<any>;
	protected abstract commitTransaction(f: BaseFunction): Promise<any>;
	protected abstract rollbackTransaction(f: BaseFunction): Promise<any>;
	protected abstract executeQuery<T>(query: QueryBase<T>): Promise<any>;
	protected abstract getTransaction(key: BaseFunction): TransactionData | undefined;
}
