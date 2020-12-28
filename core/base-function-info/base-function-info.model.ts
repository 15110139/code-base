import * as uuid from "uuid";
export abstract class BaseFunction {
	public readonly selfEventId = uuid.v4();
	public identity: any;
	public get getIdentity() {
		return this.identity;
	}
}

export class RootBaseFunction extends BaseFunction {
	identity = null;
	public transactionIdentity?: RootBaseFunction = undefined;
}
