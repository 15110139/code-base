import { Injectable, Logger, ValueProvider } from "@nestjs/common";
import { Expose, plainToClass, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, validateSync } from "class-validator";

export enum ENVIRONMENTS {
	DEVELOP = "DEVELOP",
	SIT = "SIT",
	UAT = "UAT",
	PRODUCT = "PRODUCT",
}

export class Environments {
	@Expose()
	@Type(() => String)
	@IsString()
	public API_PREFIX = "/v1";

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public API_PORT = 3000;

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public DB_PORT = 5432;

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_HOST = "localhost";

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_NAME = "post_project";

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_USER = "root";

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_PASSWORD = "12345678";

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public DB_CONNECTION_LIMIT = 10;

	@Expose()
	@Type(() => String)
	@IsString()
	public JWT_ISSUER = "tienbmdev97";

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public EXPIRE_TIME: number = 7 * 24 * 60 * 60;

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public LIMIT_POST_NORMAL: number = 7 * 24 * 60 * 60;

	@Expose()
	@Type(() => String)
	@IsString()
	public JWT_SECRET = "JWT_SECRET";

	@Expose()
	@IsString()
	@Type(() => String)
	public MQ_HOST = "localhost";

	@Expose()
	@IsString()
	@Type(() => String)
	public MQ_USER = "admin";

	@Expose()
	@IsString()
	@Type(() => String)
	public MQ_PASSWORD = "admin";

	@Expose()
	@IsNumber()
	@Type(() => Number)
	public MQ_PORT = 5672;

	@Expose()
	@Type(() => String)
	@IsString()
	public REDIS_HOST = "localhost";

	@Expose()
	@IsNumber()
	@Type(() => Number)
	public REDIS_PORT = 6379;

	@Expose()
	@Type(() => String)
	@IsString()
	public REDIS_USER = "admin";

	@Expose()
	@IsString()
	@Type(() => String)
	public REDIS_PASSWORD = "admin";

	@Expose()
	@IsBoolean()
	@Type(() => Boolean)
	public DISPLAY_ERROR_DETAIL = false;
}

@Injectable()
export class EnvironmentsService {
	protected logger = new Logger(EnvironmentsService.name);

	public readonly ENVIRONMENTS: Environments;

	constructor() {
		this.ENVIRONMENTS = plainToClass(
			Environments,
			{
				...new Environments(),
				...process.env,
			},
			{
				excludeExtraneousValues: true,
			},
		);
		const resValidateEnv = validateSync(this.ENVIRONMENTS);
		if (resValidateEnv.length) {
			throw resValidateEnv;
		}
	}
}

export const EnvironmentsProvider: ValueProvider<EnvironmentsService> = {
	provide: EnvironmentsService,
	useValue: new EnvironmentsService(),
};
