import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { PostItem } from "./post.model";

export class GetPostParam {
	@Expose()
	@IsString()
	post_id: string;
}

export class GetPostResponse extends PostItem {}

export const GetPostURL = "/post/:post_id";
