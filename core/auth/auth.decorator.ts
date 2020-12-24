import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
	SetMetadata,
	UnauthorizedException,
} from "@nestjs/common";
import { Constructor } from "src/@types/global";
import { JWTPayload } from "./auth.model";

export const IS_PUBLIC_KEY = "IS_PUBLIC_KEY";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// interface IRequest<T extends JWTPayload> {
// 	user: T & { [key: string]: any };
// }

export const JWTContent = createParamDecorator(
	<T extends JWTPayload>(
		tokenType: Constructor<T>,
		context: ExecutionContext,
	): JWTPayload => {
		const req = context.switchToHttp().getRequest();
		if (!tokenType) {
			console.log("Wrong token type implementation")
			throw new InternalServerErrorException(
				"Wrong token type implementation",
			);
		}

		if (!req.user) {
			console.log("Don't have info token")
			throw new UnauthorizedException();
		}

		return req.user;
	},
);
