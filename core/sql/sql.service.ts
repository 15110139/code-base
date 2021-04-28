import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { CONNECTION_NAME } from "@internal/shared/constant/connection-database";
import {
	Injectable,
	InternalServerErrorException,
	Logger,
	ValueProvider,
} from "@nestjs/common";
import { getConnection } from "typeorm";
import {
	BaseFunction,
	RootBaseFunction,
} from "../base-function-info/base-function-info.model";
import {
	QueryBase,
	TransactionCommit,
	TransactionData,
	TransactionMap,
	TransactionStart,
} from "../base-service/base-sql";

export abstract class SqlBase {
	protected abstract startTransaction(f: BaseFunction): Promise<any>;
	protected abstract commitTransaction(f: BaseFunction): Promise<any>;
	protected abstract rollbackTransaction(f: BaseFunction): Promise<any>;
	protected abstract executeQuery<T>(query: QueryBase<T>): Promise<any>;
	protected abstract getTransaction(
		key: BaseFunction,
	): TransactionData | undefined;
}

@Injectable()
export class SqlService extends SqlBase {
	private logger = new Logger(SqlService.name);
	private transactionMap: TransactionMap = new Map();
	protected static instanceSqlBase: SqlService;
	public static getInstance() {
		if (SqlService.instanceSqlBase) {
			return SqlService.instanceSqlBase;
		}
		SqlService.instanceSqlBase = new SqlService();
		return SqlService.instanceSqlBase;
	}
	public async startTransaction(f: BaseFunction): Promise<void> {
		const startTransaction = new TransactionStart(f);
		const transactionIdentity = this.getTransactionIdentity(
			startTransaction,
		);
		this.logger.log(`Start transaction: ${startTransaction.selfEventId}`);
		const transaction = this.transactionMap.get(transactionIdentity);
		if (transaction) {
			this.logger.log(
				"Has parent transaction here, use parent transaction",
			);
			transaction.count = transaction.count + 1;
			return;
		}

		const queryRunner = getConnection(
			CONNECTION_NAME.DEFAULT,
		).createQueryRunner();
		queryRunner.connect();
		await queryRunner.startTransaction();
		const managerTransaction = queryRunner.manager;
		this.addTransactionMap(transactionIdentity, {
			count: 0,
			callBlackReleaseLock: [],
			managerTransaction: managerTransaction,
			queryRunner: queryRunner,
		});
		this.logger.log(
			`New transaction with transaction identity: ${transactionIdentity.selfEventId}`,
		);
		let duration = 10000;
		const transactionInterval = setInterval(() => {
			if (this.transactionMap.get(transactionIdentity)) {
				this.logger.error(
					`Long running transaction detected: ----- Make sure this is intentional`,
				);
				this.logger.error(`Some transaction start but not commit`);
				this.logger.error(
					`Function name: ${transactionIdentity.constructor.name}`,
				);
				this.logger.error(`Duration: ${duration / 1000} seconds`);
				duration += 10000;
			} else {
				clearInterval(transactionInterval);
			}
		}, duration);
		return;
	}
	public async commitTransaction(f: BaseFunction) {
		const transactionCommit = new TransactionCommit(f);
		this.logger.log(`Commit transaction: ${transactionCommit.selfEventId}`);
		const transactionIdentity = this.getTransactionIdentity(
			transactionCommit,
		);
		const transaction = this.transactionMap.get(transactionIdentity);
		if (!transaction) {
			this.logger.error(
				`Don't have transaction with identity ${transactionCommit.identity}`,
			);
			throw new InternalServerErrorException(
				SYSTEM_CODE.INTERNAL_SERVER_ERROR,
			);
		}
		if (transaction.count !== 0) {
			transaction.count = transaction.count - 1;
		} else {
			const queryRunner = transaction.queryRunner;
			await queryRunner.commitTransaction();
			await queryRunner.release();
			this.deleteTransaction(transactionCommit.identity);
		}
	}

	public async rollbackTransaction(f: BaseFunction) {
		this.logger.log(`Rollback transaction: ${f.selfEventId}`);
		const transactionIdentity = this.getTransactionIdentity(f);
		if (!transactionIdentity) {
			this.logger.error("Don't have any identity");
			throw new InternalServerErrorException(
				SYSTEM_CODE.INTERNAL_SERVER_ERROR,
			);
		}
		const transaction = this.getTransaction(transactionIdentity);
		if (transaction) {
			const queryRunner = transaction.queryRunner;
			await queryRunner.rollbackTransaction();
			await transaction.queryRunner.release();
			this.deleteTransaction(f);
		} else {
			this.logger.log("Don't have any transaction rollback");
		}
	}

	private addTransactionMap(
		key: BaseFunction,
		transactionData: TransactionData,
	) {
		this.logger.log(`Add new transaction with: ${key.selfEventId}`);
		this.transactionMap.set(key, transactionData);
	}

	public getTransaction(key: BaseFunction): TransactionData | undefined {
		return this.transactionMap.get(key);
	}

	private deleteTransaction(identity: BaseFunction) {
		this.logger.log(`Delete transaction: ${identity.selfEventId}`);
		const transactionIdentity = this.getTransactionIdentity(identity);
		this.transactionMap.delete(transactionIdentity);
	}
	public async executeQuery<T>(query: QueryBase<T>) {
		const transactionIdentity = this.getTransactionIdentity(query);
		const transaction = this.transactionMap.get(transactionIdentity);
		if (!transaction) {
			this.logger.error("Don't have any transaction to execute query");
			throw new InternalServerErrorException();
		}
		query.repository = transaction.managerTransaction.getRepository(
			query.repository.target,
		);
		return await query.execute();
	}

	private getTransactionIdentity(e: BaseFunction): BaseFunction {
		if (e instanceof RootBaseFunction) {
			return e;
		}
		if (e instanceof QueryBase) {
			return this.getTransactionIdentity(
				e.transactionIdentity || e.identity,
			);
		}
		return this.getTransactionIdentity(e.identity);
	}
}

export const SqlBaseProvider: ValueProvider<SqlService> = {
	provide: SqlService,
	useValue: new SqlService(),
};
