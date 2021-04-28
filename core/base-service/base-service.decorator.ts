import { BaseFunction } from "../base-function-info/base-function-info.model";
import { SqlService } from "../sql/sql.service";

export function HandlerFunction() {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	return (
		_target: any,
		_propertyKey: string,
		descriptor: PropertyDescriptor,
	): any => {
		const originalMethod: any = descriptor.value;
		descriptor.value = async function(...args: any[]) {
			const identity: BaseFunction = args[0];
			try {
				const result = await originalMethod.apply(this, args);
				return result;
			} catch (error) {
				await SqlService.getInstance().rollbackTransaction(identity);
				throw error;
			}
		};

		return descriptor;
	};
}
