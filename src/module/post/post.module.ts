import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentsModule } from "@internal/core/environment/environment.module";
import { PostEntity } from "@internal/database/entities/post.entity";
import { PostController } from "./post.controller";
import { PostRepository } from "./post.reposiotry";
import { HouseEntity } from "@internal/database/entities/house.entity";
import { StreetEntity } from "@internal/database/entities/street.entity";
import { StreetRepository } from "./street.repository";
import { CreateHouseAndStreet } from "./usecase/create-post.usecase";
import { CreateUserCaseService } from "./usecase/create-poist.usercase";
import { PeopleEntity } from "@internal/database/entities/people.entity";
import { AuthModule } from "@internal/core/auth/auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PostEntity,
			HouseEntity,
			StreetEntity,
			PeopleEntity,
		]),
		EnvironmentsModule,
		AuthModule,
	],
	providers: [
		CreateUserCaseService,
		PostRepository,
		StreetRepository,
		CreateHouseAndStreet,
	],
	controllers: [PostController],
	exports: [CreateHouseAndStreet],
})
export class PostModule {}
