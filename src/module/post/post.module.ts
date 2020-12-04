import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentsModule } from "@internal/core/environment/environment.module";
import { PostEntity } from "@internal/database/entities/post.entity";
import { PostController } from "./post.controller";
import { PostRepository } from "./post.reposiotry";
import { PostService } from "./post.service";

@Module({
	imports: [TypeOrmModule.forFeature([PostEntity]), EnvironmentsModule],
	providers: [PostRepository, PostService],
	controllers: [PostController],
	exports: [PostService],
})
export class PostModule {}
