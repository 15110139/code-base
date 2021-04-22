import { ResponseApiInterface } from "@internal/shared/api-interface/base-api-interface";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	RequestTimeoutException,
	HttpException,
} from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { I18NextProvider, LANGUE } from "../i18next/i18next.service";

@Injectable()
export class ResponseApiInterceptor<T>
	implements NestInterceptor<T, ResponseApiInterface<T>> {
	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<ResponseApiInterface<T>> {
		// const request: Request = context.switchToHttp().getRequest();
		console.log("request");
		// const language: LANGUE = request.headers.get("Accept language") as
		// 	| LANGUE
		// 	| LANGUE.EN_US;
		const language = LANGUE.EN_US;
		return next.handle().pipe(
			map(
				data => ({ data, systemCode: SYSTEM_CODE.SUCCESS }),
				catchError((err: HttpException | Error) => {
					let httpCode = 500;
					if (err instanceof HttpException) {
						httpCode =
							err && err.getStatus ? err.getStatus() : httpCode;
					}
					if (err instanceof TimeoutError) {
						return throwError(new RequestTimeoutException());
					}
					let systemCode = SYSTEM_CODE.SORRY_SOMETHING_WENT_WRONG;
					if (httpCode === 400) {
						systemCode = SYSTEM_CODE.BAD_REQUEST;
					} else if (httpCode === 401) {
						systemCode = SYSTEM_CODE.UNAUTHORIZED;
					} else if (httpCode === 403) {
						systemCode = SYSTEM_CODE.FORBIDDEN;
					}
					systemCode = err.message as SYSTEM_CODE;
					return I18NextProvider.useValue.translation(
						language,
						systemCode,
						undefined,
						err,
					);
				}),
			),
		);
	}
}
