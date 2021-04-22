import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@internal/database/entities/user.entity";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserDetailService } from "./user-detail.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UserRepository, UserService, UserDetailService],
	controllers: [UserController],
	exports: [UserService, UserDetailService],
})
export class UserModule {}
