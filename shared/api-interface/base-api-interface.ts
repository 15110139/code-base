import { Constructor } from "src/@types/global";

export class ResponseApiInterface<T> {
	constructor(
		public data: T,
		public systemCode: string,
		public message?: string,
		public debugError?:unknown
	) {}
}

export enum METHOD {
	POST = "POST",
	DELETE = "DELETE",
	PUT = "PUT",
	GET = "PUT",
}

export abstract class DTO {
	public abstract headerDTO: any;
	public abstract paramsDTO: any;
	public abstract queryDTO: any;
	public abstract bodyDTO: any;
	public abstract readonly url: string;
	public abstract readonly method: METHOD;
	public abstract readonly responseDTOClass: Constructor<any>;

	public get interpolatedUrl(): string {
		let url = this.url;
		if (this.paramsDTO) {
			Object.keys(this.paramsDTO).forEach(key => {
				url = url.replace(":" + key, String(this.paramsDTO[key]));
			});
		}
		if (this.queryDTO) {
			Object.keys(this.queryDTO).forEach((key, index) => {
				if (this.queryDTO[key]) {
					url +=
						(index === 0 ? "?" : "&") +
						key +
						"=" +
						String(this.queryDTO[key]);
				}
			});
		}
		return url;
	}
}
