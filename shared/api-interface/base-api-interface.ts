export class ResponseApiInterface<T> {
	public instanceId?: string;

	constructor(
		public data: T,
		public message: string,
		public systemCode: string,
		public debugError?: T,
	) {
	}
}

export enum METHOD {
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  GET = 'PUT',
}
