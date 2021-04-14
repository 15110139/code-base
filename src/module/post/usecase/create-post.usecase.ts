import { PostEntity } from "@internal/database/entities/post.entity";
import { StreetEntity } from "@internal/database/entities/street.entity";
import { ListPostQuery } from "@internal/shared/api-interface/post/find-post-interface";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import * as uuid from "uuid";
import { HouseEntity } from "@internal/database/entities/house.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseApplication } from "@internal/core/base-service/base-service.model";
import { CreateHouseQuerySQL, CreateStreetQuerySQL } from "../repository";
import { HandlerFunction } from "@internal/core/base-service/base-service.decorator";
import { BaseFunction } from "@internal/core/base-function-info/base-function-info.model";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { CreateUserCaseService } from "./create-poist.usercase";

@Injectable()
export class CreateHouseAndStreet extends BaseApplication {
	constructor(
		@InjectRepository(PostEntity)
		private streetRepository: Repository<StreetEntity>,
		@InjectRepository(HouseEntity) private houseRe: Repository<HouseEntity>,
		private createUserCaseService: CreateUserCaseService,
	) {
		super();
	}

	@HandlerFunction()
	public async execute(
		identity: BaseFunction,
		data: {
			_userType: TOKEN_TYPE;
			_paging: {
				page: number;
				pageSize: number;
				_query: ListPostQuery;
			};
		},
	): Promise<any> {
		this.logger.info(JSON.stringify(data, null, 0));
		await this.sqlBase.startTransaction(identity);
		const newStreet = new StreetEntity();
		newStreet.name = "Le Qunag Dinh";
		newStreet.street_id = uuid.v4();
		const street = await this.sqlBase.executeQuery<StreetEntity>(
			new CreateStreetQuerySQL(
				identity,
				newStreet,
				this.streetRepository,
			),
		);
		if (Math.floor(Math.random() * 10 + 1) % 2 == 0) {
			this.logger.error("Generate error random");
			throw new BadRequestException(SYSTEM_CODE.BAD_REQUEST);
		}
		const newHouse = new HouseEntity();
		newHouse.name = "Tien's House";
		newHouse.house_id = uuid.v4();
		newHouse.street_id = street.street_id;
		const house = await this.sqlBase.executeQuery<HouseEntity>(
			new CreateHouseQuerySQL(identity, newHouse, this.houseRe),
		);

		const people = await this.createUserCaseService.execute(
			identity,
			{
				houseId: house.house_id,
			},
		);

		await this.sqlBase.commitTransaction(identity);
		this.logger.info(JSON.stringify(people, null, 0));
		this.logger.info(JSON.stringify(house, null, 0));
		return null;
	}

	public async getPost(_postId: string): Promise<any> {
		return {};
	}

	// private generateFilter(filterData: ListPostQuery) {
	// 	const condition: FindConditions<PostEntity> = {
	// 		have_seen_at: Between<Date>(
	// 			filterData.start_have_seen_at || new Date("1970-01-01"),
	// 			filterData.end_have_end_at || new Date(),
	// 		),
	// 		create_at: Between<Date>(
	// 			filterData.start_create_at || new Date("1970-01-01"),
	// 			filterData.end_create_at || new Date(),
	// 		),
	// 	};
	// 	if (filterData.product_class) {
	// 		condition.product_class = filterData.product_class;
	// 	}
	// 	if (filterData.is_image) {
	// 		condition.is_image = filterData.is_image;
	// 	}

	// 	if (filterData.is_video) {
	// 		condition.is_video = filterData.is_video;
	// 	}
	// 	return condition;
	// }

	// private generateSort(sort: string) {
	// 	if (!sort || sort.length === 0) {
	// 		return null;
	// 	}
	// 	const listArray = sort.split(",");
	// 	const ObjectSort: any = {};
	// 	listArray.forEach((el: string) => {
	// 		const [property, sortType] = el.split(":");
	// 		if (checkValidPrefix(sortType) && checkValidProperty(property))
	// 			ObjectSort[property] = sortType;
	// 	});

	// 	function checkValidPrefix(prefix) {
	// 		console.log("prefix", prefix);

	// 		const constantPrefix = ["ASC", "DESC", 1, -1, "1", "-1"];
	// 		if (!prefix) {
	// 			return false;
	// 		}

	// 		if (!constantPrefix.includes(prefix)) {
	// 			return false;
	// 		}
	// 		return true;
	// 	}

	// 	function checkValidProperty(property) {
	// 		if (!property) {
	// 			return false;
	// 		}
	// 		const listProperty = [
	// 			"post_id",
	// 			"likes",
	// 			"comments",
	// 			"shares",
	// 			"description",
	// 			"call_to_action_url",
	// 			"image_url",
	// 			"facebook_account_id",
	// 			"have_seen_at",
	// 			"description_url",
	// 			"is_image",
	// 			"is_video",
	// 			"is_activated",
	// 			"genre_id",
	// 			"interaction",
	// 			"page_name",
	// 			"page_picture",
	// 			"page_id",
	// 			"last_seen_at",
	// 			"country",
	// 			"ecom_platform_id",
	// 			"product_class",
	// 		];
	// 		if (!listProperty.includes(property)) {
	// 			return false;
	// 		}

	// 		return true;
	// 	}
	// }

	// private generateDataQueryWithNormalUser(pageSize: number, page: number) {
	// 	const skip = page * pageSize;
	// 	if (skip >= this.envService.ENVIRONMENTS.LIMIT_POST_NORMAL) {
	// 		const limitRemaining =
	// 			skip -
	// 			this.envService.ENVIRONMENTS.LIMIT_POST_NORMAL / pageSize;
	// 		if (limitRemaining / pageSize > 1) {
	// 			return {
	// 				isQuery: false,
	// 				limit: null,
	// 			};
	// 		} else {
	// 			return { isQuery: true, limit: limitRemaining };
	// 		}
	// 	} else {
	// 		return {
	// 			isQuery: true,
	// 			limit: pageSize,
	// 		};
	// 	}
	// }
}
