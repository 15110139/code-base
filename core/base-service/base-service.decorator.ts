import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlBase } from "../sql/sql.service";
// import { BaseApplication } from "./base-service.model";

export function HandlerFunction() {
	return function(
		_target: any,
		_propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;
		descriptor.value = async function(...args: any[]) {
			let identity: BaseFunction = args[0];
			// let metaData = args[2];
			// (this as BaseApplication).logger.setTraceId(metaData.traceId);
			try {
				const result = await originalMethod.apply(this, args);
				return result;
			} catch (error) {
				await SqlBase.getInstance().rollbackTransaction(identity);
				throw error;
			}
		};

		return descriptor;
	};
}
