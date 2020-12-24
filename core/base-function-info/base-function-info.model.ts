import * as uuid from "uuid";
export abstract class BaseFunction {
	public readonly _pendingChain: number = 0;
	public readonly _hadSuccess: boolean = false;
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
