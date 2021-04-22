import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EnvironmentsModule } from "../core/environment/environment.module";
import { EnvironmentsService } from "../core/environment/environment.service";
import { Logger, QueryRunner } from "typeorm";
import { LoggerService } from "@internal/core/base-service/logger.service";

export class DBLogger implements Logger {
	private context = "DB";
	constructor(public logger: LoggerService) {
		logger.setContext(this.context);
	}
	public logQuery(
		query: string,
		parameters?: any[],
		_queryRunner?: QueryRunner,
	): any {
		this.log("log", query);
		parameters && this.log("log", parameters);
	}
	
	public logQueryError(
		error: string | Error,
		query: string,
		parameters?: any[],
		_queryRunner?: QueryRunner,
	) {
		this.log("error", error);
		this.log("error", query);
		parameters && this.log("error", parameters);
	}
	public logQuerySlow(
		time: number,
		query: string,
		parameters?: any[],
		_queryRunner?: QueryRunner,
	) {
		this.log("warn", time + " slow with query " + query);
		parameters && this.log("warn", parameters);
	}
	public logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
		this.log("log", message);
	}
	public logMigration(message: string, _queryRunner?: QueryRunner) {
		this.log("log", message);
	}
	public log(
		level: "warn" | "info" | "log" | "error",
		message: any,
		_queryRunner?: QueryRunner,
	): void {
		if (level === "log") {
			this.logger.log(message);
		} else if (level === "info") {
			this.logger.log(message);
		} else if (level === "warn") {
			this.logger.warn(message);
		} else if (level === "error") {
			this.logger.error(message);
		}
	}
}

export const typeormModule = (logger: LoggerService) =>
	TypeOrmModule.forRootAsync({
		inject: [EnvironmentsService],
		useFactory: async (
			env: EnvironmentsService,
		): Promise<TypeOrmModuleOptions> => {
			return <TypeOrmModuleOptions>{
				name: "default",
				logging: true,
				logger: new DBLogger(logger),
				type: "postgres",
				host: env.ENVIRONMENTS.DB_HOST,
				port: env.ENVIRONMENTS.DB_PORT,
				username: env.ENVIRONMENTS.DB_USER,
				database: env.ENVIRONMENTS.DB_NAME,
				password: env.ENVIRONMENTS.DB_PASSWORD,
				dropSchema: false,
				entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
				keepConnectionAlive: true,
				extra: {
					connectionLimit: env.ENVIRONMENTS.DB_CONNECTION_LIMIT,
				},
			};
		},
		imports: [EnvironmentsModule],
	});
