import { Module } from "@nestjs/common";
import { AuthModule } from "@internal/core/auth/auth.module";
// import { PostModule } from "./module/post/post.module";
import { UserAuthModule } from "./module/user-auth/user-auth.module";
// import { UserModule } from "./module/user/user.module";
import { EnvironmentsModule } from "@internal/core/environment/environment.module";
import { typeormModule } from "@internal/database/typeorm.module";
// import { SqlModule } from "@internal/core/sql/sql.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtGuardPublic } from "@internal/core/auth/auth.guard";
import { ResponseApiInterceptor } from "@internal/core/interceptor/response.interceptor";
import { LoggerService } from "@internal/core/base-service/logger.service";

@Module({
	imports: [
		// PostModule,
		// UserModule,
		AuthModule,
		EnvironmentsModule,
		UserAuthModule,
		// SqlModule,
		typeormModule(new LoggerService()),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtGuardPublic,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseApiInterceptor,
		},
	],
})
export class AppModule {}
