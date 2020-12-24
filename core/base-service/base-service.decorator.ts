import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlBase } from "../sql/sql.service";

export function HandlerFunction() {
	return function(
		_target: any,
		_propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;
		descriptor.value = async function(...args: any[]) {
			let identity: BaseFunction = args[0];

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
