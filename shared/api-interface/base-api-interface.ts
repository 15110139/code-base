export class ResponseApiInterface<T> {
	constructor(
		public data: T,
		public systemCode: string,
		public message?: string,
	) {}
}

export enum METHOD {
	POST = "POST",
	DELETE = "DELETE",
	PUT = "PUT",
	GET = "PUT",
}
