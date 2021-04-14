import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlBase } from "../sql/sql.service";
import { LoggerService } from "./logger.service";
import { v4 } from "uuid";
import Axios, { AxiosInstance } from "axios";
export abstract class BaseApplication extends BaseFunction {
	private traceId!: string;
	protected getTraceId(): string {
		return this.traceId;
	}
	abstract execute(
		identity: BaseFunction | null | undefined,
		data: { [key: string]: any },
	): Promise<any>;
	protected sqlBase = SqlBase.getInstance();
	protected readonly logger = new LoggerService().setContext(
		this.constructor.name,
	);

	protected httpService!: AxiosInstance;
	public initTraceId = (traceId: string = v4()): BaseApplication => {
		this.logger.setTraceId(traceId);
		this.traceId = traceId;
		this.httpService = Axios.create({
			headers: {
				"x-trace-id": traceId,
			},
		});
		return this;
	};
}
