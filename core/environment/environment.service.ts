import { Injectable, Logger, ValueProvider } from "@nestjs/common";
import { Expose, plainToClass, Type } from "class-transformer";
import { IsNumber, IsString, validateSync } from "class-validator";

export enum ENVIRONMENTS {
	DEVELOP,
	SIT,
	UAT,
	PRODUCT,
}

export class Environments {
	@Expose()
	@Type(() => String)
	@IsString()
	public API_PREFIX: string = "/v1";

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public API_PORT: number = 3000;

	@Expose()
	@Type(() => Number)
	@IsNumber()
	public DB_PORT: number = 5432;

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_HOST: string = "localhost";

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_NAME: string = "post_project";

	@Expose()
	@Type(() => String)
	@IsString()
	public DB_USER: string = "root";

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
	public JWT_ISSUER: string = "tienbmdev97";

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
	public JWT_SECRET: string = "JWT_SECRET";
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
