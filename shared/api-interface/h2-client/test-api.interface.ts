import { DTO, METHOD } from "../base-api-interface";

export class TestBodyResponse {
	data!: string;
}

export class TestDTO extends DTO {
	public static url = "api/test";

	public readonly responseDTOClass = TestBodyResponse;
	public readonly url = TestDTO.url;

	public readonly bodyDTO = undefined;
	public readonly headerDTO = undefined;
	public readonly method = METHOD.GET;
	public readonly paramsDTO = undefined;
	public readonly queryDTO = undefined;

	constructor() {
		super();
	}
}
