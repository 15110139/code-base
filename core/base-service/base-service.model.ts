import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlBase } from "../sql/sql.service";
import { LoggerService } from "./logger.service";

export abstract class BaseApplication extends BaseFunction {
	abstract execute(
		identity: BaseFunction | null | undefined,
		data: { [key: string]: any },
		metaData: {
			traceId: string;
		},
	): Promise<any>;
	protected sqlBase = SqlBase.getInstance();
	logger = new LoggerService();
}
