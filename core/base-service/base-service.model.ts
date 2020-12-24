import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlBase } from "../sql/sql.service";

export abstract class BaseApplication extends BaseFunction {
	abstract execute(
		identity: BaseFunction | null| undefined,
		...arg: any
	): Promise<any>;
	protected sqlBase = SqlBase.getInstance();

	
}
